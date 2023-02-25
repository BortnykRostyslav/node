const usersService = require('./user.service');
const { NotFound, BadRequest, Unauthorized} = require('@error');
const { newUserSchema } = require('./user.validator');
const { IMAGE_MAX_SIZE, IMAGE_MIMETYPES } = require('@configs/file.configs');


module.exports = {
    getUserDynamically: (paramName, from, dbField = paramName) => async (req, res, next) => {
        try {
            const searchData = req[from][paramName];

            const user = await usersService.findUserByParams({[dbField]: searchData});

            if (!user) {
                throw new NotFound('User not found');
            }

            req.locals = {...req.locals,user};

            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserDuplicates: (paramName, from, dbField = paramName) => async (req, res, next) => {
        try {
            const searchData = req[from][paramName];

            const user = await usersService.findUserByParams({[dbField]: searchData});

            if (user) {
                throw new NotFound('User with such info already exists');
            }

            next();
        } catch (e) {
            next(e);
        }
    },

    newUserValidator: async (req, res, next) => {
        try {
            const {error, value} = newUserSchema.validate(req.body);

            if (error) {
                throw new BadRequest(error);
            }

            req.body = value;
            next();
        } catch (e) {
            next(e);
        }
    },

    checkUserAvatar: (req, res, next) => {
        try {
            if(!req.files?.avatar){
                throw new BadRequest('No file');
            }

            const { name, size, mimetype } = req.files.avatar;

            if(size > IMAGE_MAX_SIZE){
                throw new BadRequest(`File ${name} is too big`);
            }

            if(!IMAGE_MIMETYPES.includes(mimetype)){
                throw new BadRequest('Not valid file type');
            }

            next();
        } catch (e) {
            next(e);
        }
    }
};