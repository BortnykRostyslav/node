const users = [];

function findUserBySocketId(socketId){
    return users.find( user => user.id === socketId);
}

function getChatMembers() {
    return users;
}
function userJoinRoom(socketId, userName, roomName){
    const user = { id: socketId, userName, roomName };

    users.push(user);

    return user;
}

function userLeaveRoom(socketId){
    const userIndex = users.findIndex(user => user.id === socketId);

    if(userIndex === -1){
        return;
    }

    users.splice(userIndex, 1);
}

module.exports = {
    findUserBySocketId,
    getChatMembers,
    userJoinRoom,
    userLeaveRoom
}