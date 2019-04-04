const passport = require('passport');
const ObjectID = require('mongodb').ObjectID;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;

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
  
  // Github strategy
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: '/auth/github/callback'
  }, 
  (accessToken, refreshToken, profile, cb) => {
      // Load the users database object if it exists or create one if it doesn't 
      db.collection('socialusers').findAndModify(
      {id: profile.id},  // use github's profile.id to query
      {}, // sort none
      {
        $setOnInsert:{ // $setOnInsert: If none found, creates doc with these values else does nothing
          id: profile.id,
          name: profile.displayName || 'Will Mallett',
          photo: profile.photos[0].value || '',
          email: profile.emails[0].value || 'No public email',
          created_on: new Date(),
          provider: profile.provider || ''
        },
        $set:{ last_login: new Date() },
        $inc:{ login_count: 1 }
      },
      { upsert:true, new: true }, // upsert true: if none make new, if found update
      (err, doc) => {
        if (err) return cb(err);
        return cb(null, doc.value);
      }
    );
  }));
};


