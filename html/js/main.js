/* eslint-disable */

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io('http://localhost:5000');

socket.emit('joinRoom', {username, room});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.msg.value;

    socket.emit('chatMessages', message);

    e.target.msg.value = '';
});

socket.on('message', (messageData) => {
    appendMessageToChat(messageData);
});

socket.on('userList', (chatInfo) => {
    roomName.innerText = chatInfo.chatName;

    userList.innerHTML = '';

    const userElementArray = chatInfo.members.map(member => {
        const singleUserEl = document.createElement('li');
        singleUserEl.innerText = member.userName;

        return singleUserEl;
    });

    userList.append(...userElementArray);
});


/**
 * THis function draw new message div to chat window
 * @param messageData {{message: String, senderName: String, type: String}}
 */
function appendMessageToChat(messageData) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    const senderNameEl = document.createElement('p');
    const messageTextEl = document.createElement('p');

    senderNameEl.classList.add('meta');
    senderNameEl.innerText = messageData.senderName;

    messageTextEl.classList.add('text');
    messageTextEl.innerText = messageData.message;

    messageDiv.append(senderNameEl, messageTextEl);
    chatMessages.append(messageDiv);
}