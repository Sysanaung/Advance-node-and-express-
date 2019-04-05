const express = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const passport = require('passport');
const mongo = require('mongodb').MongoClient;
const app = express();
const routes = require('./routes');
const auth = require('./auth');
const http = require('http').Server(app);
const io = require('socket.io')(http);

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, { useNewUrlParser: true }, (err, db) => {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    
    // authorize user
    auth(app, db);
    
    // go to specific route
    routes(app, db);
    
    // keep track of connected io users
    let currentUsers = 0;
    
    // socket is an individual client that has connected
    io.on('connection', socket => {
      console.log(`User ${socket.request.user.name} connected`);
      currentUsers++; // increment the users
      
      // emitting something from server to io, sends event's name and data to all connected sockets
      // on 'user count' event, emit currentUsers data (sent to client.js where handeled)
      io.emit('user count', currentUsers); // io.emit(event, data)
      
      // disconnect a user
      socket.on('disconnect', () => {
        console.log(`User ${socket.request.user.name} has disconnected`);
        currentUsers--;
        io.emit('user count', currentUsers);
      });
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });  
}}); 



