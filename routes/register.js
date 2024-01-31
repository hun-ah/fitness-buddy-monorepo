/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const registerController = require('../controllers/register');
const { ensureGuest } = require('../config/auth');

router.get('/', ensureGuest, registerController.getRegister);
router.post('/', registerController.registerUser);

module.exports = router;
