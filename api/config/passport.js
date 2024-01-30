/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/User');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Check for user
      User.findOne({ email: email.toLowerCase() })
        .then((user) => {
          if (!user) {
            return done(null, false, { email: 'Email is not registered' });
          }

          // Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, { password: 'Incorrect password' });
            }
          });
        })
        .catch((err) => console.log(err));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => {
        done(null, user);
      })
      .catch((err) => {
        done(err, null);
      });
  });
};
