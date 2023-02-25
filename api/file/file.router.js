const fileRouter = require('express').Router()

const controller = require('./file.controller');
const { validateAccessToken } = require('../auth/auth.middleware');

fileRouter.use(validateAccessToken);

fileRouter.get('/private', controller.getPrivateFile);

module.exports = fileRouter;