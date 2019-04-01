const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const session = require('express-session');

module.exports = (app, db) => {
  // middlewares
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
  })); 
  app.use(passport.initialize());
  app.use(passport.session());
  
  // serialize user object
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // deserialize user object
  passport.deserializeUser((id, done) => {
    db.collection('users').findOne(
      {_id: new ObjectID(id)},
      (err, doc) => {
        done(null, doc);
      }
    );
  });

  // Use local strategy
  passport.use(new LocalStrategy(
    (username, password, done) => {
      db.collection('users').findOne({ username: username }, (err, user) => {
        console.log('User '+ username +' attempted to log in.');
        if (err) return done(err); 
        if (!user) return done(null, false); 
        if (!bcrypt.compareSync(password, user.password)) return done(null, false); 
        return done(null, user);
      });
    }
  ));
};