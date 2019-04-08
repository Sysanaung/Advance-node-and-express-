// this file is loaded by the page after you've authenticated
// $( document ).ready(function() { // Commenting out JQuery
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



// });
