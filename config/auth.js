/* eslint-disable no-undef */
module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: 'User is not authenticated' });
  },
  ensureGuest: (req, res, next) => {
    if (req.isAuthenticated()) {
      return res.status(401).json({ message: 'User is authenticated' });
    } else {
      return next();
    }
  },
};
