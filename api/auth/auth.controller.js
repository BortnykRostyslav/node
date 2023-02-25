const service = require('./auth.service');
const userService = require('../user/user.service');
const {oauthService, emailService} = require('../../services');
const {NO_CONTENT} = require('../../errors/errors.codes');
const {BANNED, FORGOT_PASSWORD} = require('../../configs/emailTypes.enum');
const {FORGOT_PASSWORD: forgotPasswordAction} = require('../../configs/actionTokenTypes.enum');
const {FRONTEND_URL} = require('../../configs/variables');

module.exports = {
    loginUser: async (req, res, next) => {
        try {
            const user = req.locals.user;

            //await emailService.sendMail(' ', BANNED);
            await oauthService.checkPassword(user.password, req.body.password);

            const tokenPair = oauthService.generateNewAccessTokenPair({...user});

            await service.createOauthPair({...tokenPair, user: user._id});
            res.json({
                ...tokenPair,
                user
            });
        } catch (e) {
            next(e);
        }
    },

    logoutUser: async (req, res, next) => {
        try {
            const accessToken = req.get('Authorization');
            await service.deleteOneByParams({accessToken});

            // logout all platforms
            // await service.deleteManyByParams({user: req.user._id});
            res.status(NO_CONTENT).json('ok');
        } catch (e) {
            next(e);
        }
    },

    refresh: async (req, res, next) =>{
        try {
            const user = req.user;

            const refreshToken = req.get('Authorization');
            await service.deleteOneByParams({refreshToken});

            const tokenPair = oauthService.generateNewAccessTokenPair({...user});

            await service.createOauthPair({...tokenPair, user: user._id});
            res.json({
                ...tokenPair,
                user
            });
        } catch (e){
            next(e);
        }
    },

    sendForgotPasswordEmail: async (req, res, next) => {
        try {
            const user = req.locals.user;
            const forgotPasswordToken = oauthService.generateActionToken(
                forgotPasswordAction,
                {email: user.email}
            );

            await service.createActionToken({
                actionToken: forgotPasswordToken,
                token: forgotPasswordToken,
                user: req.locals.user._id
            });

            const forgotPassURL = `${FRONTEND_URL}/password/forgot?token=${forgotPasswordToken}`;

            await emailService.sendMail('bortnikrostislav370@gmail.com', FORGOT_PASSWORD,{forgotPassURL});

            res.json('ok')
        } catch (e) {
            next(e);
        }
    },

    setForgotPassword: async (req, res, next) => {
        try{
            const { _id: userId } = req.user;

            const hashPassword = await oauthService.hashPassword(req.body.password);

            await userService.updateUser(userId, { password: hashPassword });
            await service.deleteManyByParams({user: userId});

            res.json('ok')
        }catch (e) {
            next(e);
        }
    }
};