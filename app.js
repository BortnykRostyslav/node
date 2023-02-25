require('module-alias/register');
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const socketIO = require('socket.io');
const fileUpload = require('express-fileupload');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config({path: path.join(__dirname, 'env', `.env.${process.env.NODE_ENV || 'local'}`)});
global.rootPath = __dirname;

const mainRouter = require('./api/api.router');
const {PORT, MONGO_URL} = require('@configs/variables');
const {SERVER_ERROR} = require('./errors/errors.codes');
const {NotFound} = require('@error');
const swaggerDocument = require('./swagger.json');
const socketUtils = require('./utils/socket/user-socket.util');
const app = express();

const server = http.createServer(app);

const io = socketIO(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
    socket.on('joinRoom', (roomData) => {
        socket.join(roomData.room);

        socketUtils.userJoinRoom(socket.id, roomData.username, roomData.room);

        io
            .to(roomData.room)
            .emit('userList', {
                chatName: roomData.room,
                members: socketUtils.getChatMembers()
            });


        socket.broadcast
            .to(roomData.room)
            .emit('message', {
                message: `${roomData.username} join room `,
                senderName: 'System'
            });
    });

    socket.on('chatMessages', (message) => {
        const user = socketUtils.findUserBySocketId(socket.id);

        if(!user){
            return;
        }

        io
            .to(user.roomName)
            .emit('message', { message, senderName: user.userName });
    });

    socket.on('disconnect', () => {
        const user = socketUtils.findUserBySocketId(socket.id);

        socketUtils.userLeaveRoom(socket.id);
        socket.leave(user.roomName);

        io
            .to(user.roomName)
            .emit('userList', {
                chatName: user.roomName,
                members: socketUtils.getChatMembers()
            });
    })
});

mongoose.set('debug', true);
mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload({
    limits: { fileSize: 200 * 1024 * 1024 },
}));

if(process.env.NODE_ENV !== 'prod'){
    const morgan = require('morgan');

    app.use(morgan('dev'));
}


app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', mainRouter);
app.use('*', _notFoundError);
app.use(_mainErrorHandler);

server.listen(PORT, () => {
    console.log('Listen', PORT);
    // require('./cronJobs');
});


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