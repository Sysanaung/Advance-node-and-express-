// this file is loaded by the page after you've authenticated

const numberOfUsers = document.getElementById('num-users');
const messages = document.getElementById('messages');
const textBox = document.getElementById('m');

  /*global io*/
const socket = io();

function addMessageToDOM(message) {
  const li = document.createElement('li');
  li.textContent = message;
  messages.appendChild(li);
}
  
// on 'user count' do this
socket.on('user count', data => {
  console.log(data);
});

socket.on('user', data => {
  const {name, userCount, connected} = data;
  
  numberOfUsers.textContent = `${userCount} users online`;
  
  let message = name;
  
  if (connected) {
    message += ' has joined the chat.';
  } else {
    message += ' has left the chat.';
  }
  
  addMessageToDOM(message);
});

// Send a chat message to the server to emit to all the clients
const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', e => {
  const messageToSend = textBox.textContent;
  textBox.textContent = '';
  
  socket.emit('chat message', messageToSend);
});

// Receiving chat messages
socket.on('chat message', ({ name, message }) => {
  const chatMessage = `${name}: ${message}`;
  addMessageToDOM(chatMessage);
});