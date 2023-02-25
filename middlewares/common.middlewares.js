const ObjectId = require('mongoose').Types.ObjectId;

const { BadRequest } = require('../errors/ApiError');

module.exports = {
    objectIdValidator: (paramName) => (req, res, next) => {
        try {
            const isValid = ObjectId.isValid(req.params[paramName]);

            if (!isValid) {
                throw new BadRequest('ID is not valid');
            }

            next();
        } catch (e) {
            next(e);
        }
    }

};