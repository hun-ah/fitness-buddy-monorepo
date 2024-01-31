/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logout');
const { ensureAuthenticated } = require('../config/auth');

router.post('/', ensureAuthenticated, logoutController.logout);

module.exports = router;
