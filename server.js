const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const passport = require('passport');
const mongo = require('mongodb').MongoClient;
const app = express();
const routes = require('./routes');
const auth = require('./auth');
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors());
fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'pug');

mongo.connect(process.env.DATABASE, (err, db) => {
  if(err) {
    console.log('Database error: ' + err);
  } else {
    console.log('Successful database connection');
    
    // authorize user
    auth(app, db);
    
    // go to specific route
    routes(app, db);
    
    // socket is an individual client that has connected
    io.on('connection', socket => {
      console.log('A user has connected');
    });

    app.listen(process.env.PORT || 3000, () => {
      console.log("Listening on port " + process.env.PORT);
    });  
}}); 