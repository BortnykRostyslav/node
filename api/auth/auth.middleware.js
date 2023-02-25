const { Unauthorized, BadRequest } = require('../../errors/ApiError');
const oathService = require('../../services/oauth.service');
const service = require('./auth.service');

module.exports = {
    validateAccessToken: async (req, res, next) => {
        try {
            const accessToken = req.get('Authorization');

            if (!accessToken) {
                throw new Unauthorized('No token');
            }

            oathService.validateAccessToken(accessToken);

            const tokenWithUser = await service.getByParams({accessToken});


            if(!tokenWithUser){
                throw new Unauthorized('Invalid token');
            }

            console.log(tokenWithUser);

            req.user = tokenWithUser.user;
            next();
        } catch (e) {
            next(e);
        }
    },

    validateRefreshToken: async (req, res, next) => {
        try {
            const refreshToken = req.get('Authorization');

            if (!refreshToken) {
                throw new Unauthorized('No token');
            }


            oathService.validateRefreshToken(refreshToken);

            const tokenWithUser = await service.getByParams({refreshToken});


            if(!tokenWithUser){
                throw new Unauthorized('Invalid token');
            }

            console.log(tokenWithUser);

            req.user = tokenWithUser.user;
            next();
        } catch (e) {
            next(e);
        }
    },

    validateActionToken: (actionType) => async (req, res, next) => {
        try{
            const token = req.get('Authorization');

            if (!token) {
                throw new Unauthorized('No token');
            }

            await oathService.validateActionToken(token);

            const actionTokenWithUser = await  service.findActionTokenByParams({ token, actionType });

            if(!actionTokenWithUser){
                throw new BadRequest('Invalid token');
            }

            req.user = actionTokenWithUser.user;
            await service.deleteActionTokenByParams({ token });

            next();
        } catch (e) {
            next(e);
        }
    }
};