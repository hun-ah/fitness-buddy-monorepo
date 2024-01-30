/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const passport = require('passport');

module.exports = {
  getLogin: (req, res) => {
    return res.status(200).send('View login');
  },
  authenticateLogin: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      if (!user) {
        const loginError = {};
        if (info.email) {
          loginError.email = info.email;
        }
        if (info.password) {
          loginError.password = info.password;
        }
        return res.status(401).json(loginError);
      }

      req.login(user, (loginErr) => {
        if (loginErr) {
          return res.status(500).json({ error: 'Login Error' });
        }
        return res.status(200).json({
          message: 'Authentication successful',
          session: req.session,
        });
      });
    })(req, res, next);
  },
};
