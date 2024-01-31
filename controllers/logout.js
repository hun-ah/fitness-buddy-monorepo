/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const passport = require('passport');

module.exports = {
  logout: (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({ message: 'User successfully logged out' });
    });
  },
};
