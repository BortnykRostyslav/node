const apiRouter = require('express').Router();

const fileRouter = require('./file/file.router');
const userRouter = require('./user/user.router');
const authRouter = require('./auth/auth.router');

apiRouter.use('/auth', authRouter);
apiRouter.use('/files', fileRouter);
apiRouter.use('/users', userRouter);


module.exports = apiRouter;