const express = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const passport = require('passport');
const mongo = require('mongodb').MongoClient;
const session = require('express-session');
const app = express();
const routes = require('./routes');
const auth = require('./auth');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const passportSocketIo = require("passport.socketio");
const sessionStore = new session.MemoryStore();
const cookieParser = require('cookie-parser');

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  key: 'express.sid',
  store: sessionStore,
}));

mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, db) => {
  if (err) console.log('Database error: ' + err);
  else console.log('Successful database connection');
  
  // authorize user and handle routes
  auth(app, db);
  routes(app, db);
  
  http.listen(process.env.PORT || 3000);
  
  // Use of socket.io

  // Determine who is connected to io (gets passport session and deserializes it)
  // Allows access inside io connect as socket.request.user
  io.use(passportSocketIo.authorize({
    cookieParser,
    key: 'express.sid',
    secret: process.env.SESSION_SECRET,
    store: sessionStore
  }));
  
  let currentUsers = 0;
  
  // socket is an individual client that has connected
  io.on('connection', socket => {
    console.log(`User ${socket.request.user.name} connected`);
    currentUsers++; // increment the users

    // emitting something from server to io, sends event's name and data to all connected sockets
    // on 'user count' event, emit currentUsers data (sent to client.js where handeled)
    io.emit('user count', currentUsers); // io.emit(event, data)

    // Announcing new user to chat
    io.emit('user', { // obj accesible in client as data.name, data.currentUsers etc...
        name: socket.request.user.name, 
        currentUsers, 
        connected: true // false for announcing disconnect
    }); 

    // listening to the socket for the event 'chat message' with the data being named 'message'
    socket.on('chat message', message => { // emit event to all sockets
      io.emit('chat message', {
        name: socket.request.user.name,
        message
      }); 
    });

    // disconnect a user
    socket.on('disconnect', () => {
      console.log(`User ${socket.request.user.name} has disconnected`);
      currentUsers--;
      io.emit('user count', currentUsers);
    });
  });
}); 
