/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/login');
const { ensureGuest } = require('../config/auth');

router.get('/', ensureGuest, loginController.getLogin);
router.post('/', loginController.authenticateLogin);

module.exports = router;
