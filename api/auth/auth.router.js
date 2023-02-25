const authRouter = require('express').Router();

const controller = require('./auth.controller');
const mdlwr = require('./auth.middleware');
const userMdlwr = require('../user/user.middleware');
const { FORGOT_PASSWORD } = require('../../configs/actionTokenTypes.enum');

authRouter.post('/logout', mdlwr.validateAccessToken, controller.logoutUser);
authRouter.post('/refresh', mdlwr.validateRefreshToken, controller.refresh);
authRouter.patch('/password/forgot', mdlwr.validateActionToken(FORGOT_PASSWORD), controller.setForgotPassword);


authRouter.use(userMdlwr.getUserDynamically('email', 'body'));
authRouter.post('/', controller.loginUser);
authRouter.post('/password/forgot', controller.sendForgotPasswordEmail);

module.exports = authRouter;