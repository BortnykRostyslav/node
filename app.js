const express = require('express');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
global.rootPath = __dirname;

const mainRouter = require('./api/api.router');
const {SERVER_ERROR} = require('./errors/errors.codes');
const {NotFound} = require('@error');
const swaggerDocument = require('./swagger.json');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    limits: { fileSize: 200 * 1024 * 1024 },
}));

if(process.env.NODE_ENV !== 'prod'){
    const morgan = require('morgan');

    app.use(morgan('dev'));
}

if(process.env.NODE_ENV !== 'test'){
    const mongoose = require('mongoose');
    const {MONGO_URL} = require('@configs/variables');

    mongoose.set('debug', true);
    mongoose.set('strictQuery', true);
    mongoose.connect(MONGO_URL);
}

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', mainRouter);
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

function _notFoundError(req, res, next) {
    next(new NotFound('Route not found'));
}

function _mainErrorHandler(err, req, res, next) {
    res
        .status(err.status || SERVER_ERROR)
        .json({
            message: err.message || 'Unknown error'
        });
}

module.exports = app;