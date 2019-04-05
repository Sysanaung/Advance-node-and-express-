// this file is loaded by the page after you've authenticated
$( document ).ready(function() {
  /*global io*/
  const socket = io();
  
  // on 'user count' do this
  socket.on('user count', (data) => {
    console.log(data);
  });
});
