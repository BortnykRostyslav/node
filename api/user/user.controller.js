const usersService = require('./user.service');
const User = require('../../dataBase/User');
const { CREATED, NO_CONTENT } = require('../../errors/errors.codes');
const { emailService, fileService } = require('../../services');
const { WELCOME } = require('../../configs/emailTypes.enum');
const { ADMIN, USER } = require('../../configs/roles.enum');

module.exports = {
    getMyProfile: async (req, res, next) => {
        try {
            const unreadMessage = 5;
            const emailContext = {
                name: req.user.firstName,
                users: await User.find().lean(),
                condition: false
            };

            if (req.user.role === ADMIN) {
                await emailService.sendMail('bortnikrostislav370@gmail.com', WELCOME, emailContext);
            }

            res.json({
                ...req.user.toObject(),
                additionalData: {unreadMessage}
            });
        } catch (e) {
            next(e);
        }
    },

    getAllUsers: async (req, res) => {
        const allUsers = await usersService.getAllUsers(req.query);
        res.json(allUsers);
    },

    createUser: async (req, res, next) => {
        try {
            const createdUser = await usersService.createUser(req.body);

            res.status(CREATED).json(createdUser);
        } catch (e) {
            next(e);
        }
    },

    getUserById: async (req, res, next) => {
        try {
            res.json(req.locals.user);
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (req, res, next) => {
        try {
            const updatedUser = await usersService.updateUser(req.params.userId, req.body);
            res.json(updatedUser);
        } catch (e) {
            next(e);
        }
    },

    deleteUser: async (req, res, next) => {
        try {
            await usersService.deleteUserById(req.params.userId);

            res.status(NO_CONTENT).end();
        } catch (e) {
            next(e);
        }
    },

    uploadUserAvatar: async (req, res, next) => {
        try {
            const internalUrl = await fileService.uploadFileToS3(req.files.avatar, req.params.userId, 'user');

            const uploadedAvatar = await usersService.uploadNewAvatar(req.params.userId, internalUrl);

            res.json(uploadedAvatar);
        } catch (e) {
            next(e);
        }
    },

    setAvatarAsMain: async (req, res, next) => {
        try {
            const { avatarId } = req.params;

            const updatedAvatarList = await usersService.setAvatarAsMain(avatarId);

            res.json(updatedAvatarList);
        } catch (e) {
            next(e);
        }
    },

    getUserAvatars:async (req, res, next) => {
        try {
            const { userId } = req.params;

            const avatarList = await usersService.getUserAvatars(userId);

            res.json(avatarList);
        } catch (e) {
            next(e);
        }
    },

    deleteUserAvatar: async (req, res, next) => {
        try {
            const { avatarId, userId } = req.params;

            await usersService.deleteUserAvatar(avatarId);

            const avatars = await usersService.getUserAvatars(userId);

            res.json(avatars);
        } catch (e) {
            next(e);
        }
    }
};