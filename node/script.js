const socket = io('http://localhost:3000');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('input-form')
const messageInput = document.getElementById('input-field');
const fileInput = document.getElementById('file-input');

const name = prompt('Enter your name:')
appendConnectedMessage('You joined');
socket.emit('new-user', name);

socket.on('chat-message', data => {
    appendMessage(data, 'left');
})

socket.on('user-connected', name => {
    appendConnectedMessage(`${name} joined`);
})

socket.on('shared-photo', (imageData) => {
    appendImage(imageData, 'left');
});

messageForm.addEventListener('submit', e => {
    e.preventDefault();
    sendMessage();
})

function appendMessage(message, side) {
    const messageElement = document.createElement('div');
    messageElement.className = side === 'left' ? 'message-left' : 'message-right';
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}

function appendImage(imageData, side) {
    const imageElement = document.createElement('img');
    imageElement.className = side === 'left' ? 'message-left' : 'message-right';
    imageElement.src = imageData;
    imageElement.height = 100;
    messageContainer.append(imageElement);
}

function appendConnectedMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = "new-connection";
    messageElement.innerText = message;
    messageContainer.append(messageElement);
}

function sendMessage() {
    const message = messageInput.value;
    appendMessage(message, 'right');
    socket.emit('send-chat-message', message);
    messageInput.value = '';
}

function sendFile() {
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageData = e.target.result;
            socket.emit('photo', imageData);
        };
        reader.readAsDataURL(file);
    }
}

document.getElementById('attach-button').addEventListener('click', () => {
    document.getElementById('file-input').click();
})

document.getElementById('file-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const imageData = e.target.result;
        socket.emit('photo', imageData);
        appendImage(imageData, 'right');
    };

    if (file) {
        reader.readAsDataURL(file);
    }
})