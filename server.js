const express = require('express');
const bodyParser = require('body-parser');
const fccTesting = require('./freeCodeCamp/fcctesting.js');
const pug = require('pug');
const app = express();
const session = require('express-session');
const passport = require('passport');
const ObjectID = require('mongodb').ObjectID; // use with deserializeUser

fccTesting(app); //For FCC testing purposes
app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up express-session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
}));

// use passport initialize and session
app.use(passport.initialize());
app.use(passport.session());

// Serialize the user authentication object (generates a key)
passport.serializeUser((user, done) => {
   done(null, user._id); // use _id. It's uniquely generated by MongoDB
 });

// Deserialize authentication object (convert key back to object)
passport.deserializeUser((id, done) => {
  db.collection('users').findOne(
      {_id: new ObjectID(id)},
      (err, doc) => {
        // done(null, doc);
        done(null, null); // for now bc don't have mongodb set up yet
      }
  );
});

// set up a template engine
app.set('view engine','pug');

app.route('/')
.get((req, res) => {
  res.render(process.cwd() + '/views/pug/index', {title: 'Hello', message: 'Please login'});
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port " + process.env.PORT);
});