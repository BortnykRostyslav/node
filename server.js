require('module-alias/register');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config({path: path.join(__dirname, 'env', `.env.${process.env.NODE_ENV || 'local'}`)});
const { PORT } = require('@configs/variables');


const app = require('./app');
const socketUtils = require('./utils/socket/user-socket.util');

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

server.listen(PORT, () => {
    console.log('Listen', PORT);
    // require('./cronJobs');
});



