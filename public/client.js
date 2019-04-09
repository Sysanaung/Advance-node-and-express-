// this file is loaded by the page after you've authenticated

  /*global io*/
const socket = io();
  
// on 'user count' do this
socket.on('user count', data => {
  console.log(data);
});

socket.on('user', data => {
  const {name, userCount, connected} = data;
  const numberOfUsers = document.getElementById('num-users');
  const messages = document.getElementById('messages');
  
  numberOfUsers.textContent = `${userCount} users online`;
  
  let message = name;
  
  if (connected) {
    message += ' has joined the chat.';
  } else {
    message += ' has left the chat.';
  }
  
  const li = document.createElement('li');
  li.textContent = message;
  messages.appendChild(li);
});

// Submitting a chat message
const form = document.getElementsByTagName('form')[0];

form.addEventListener('submit', e => {
  const textBox = document.getElementById('m');
  const messageToSend = textBox.textContent;
  textBox.textContent = '';
  
  socket.emit('chat message', messageToSend);
});
