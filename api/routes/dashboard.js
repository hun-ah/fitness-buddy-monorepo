/* eslint-disable no-undef */
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboard');
const { ensureAuthenticated } = require('../config/auth');
const upload = require('../middleware/multer');

/****** USER ******/
router.get('/', ensureAuthenticated, dashboardController.getDashboard);
router.put(
  '/updateProfile',
  ensureAuthenticated,
  dashboardController.updateProfile
);
router.put(
  '/updateAvatar',
  ensureAuthenticated,
  upload.single('image'),
  dashboardController.updateAvatar
);
router.delete(
  '/deleteUser',
  ensureAuthenticated,
  dashboardController.deleteUser
);

/****** CLIENTS ******/
router.get('/clients', ensureAuthenticated, dashboardController.getClients);
router.get(
  '/client/:clientId',
  ensureAuthenticated,
  dashboardController.getClient
);
router.post('/addClient', ensureAuthenticated, dashboardController.addClient);
router.put(
  '/updateClientAvatar',
  ensureAuthenticated,
  upload.single('image'),
  dashboardController.updateClientAvatar
);
router.put(
  '/updateClient',
  ensureAuthenticated,
  dashboardController.updateClient
);
router.delete(
  '/deleteClient',
  ensureAuthenticated,
  dashboardController.deleteClient
);

/****** APPOINTMENTS ******/
router.get(
  '/appointments',
  ensureAuthenticated,
  dashboardController.getAppointments
);
router.get(
  '/appointments/:selectedDate',
  ensureAuthenticated,
  dashboardController.getSelectedAppointments
);
router.get(
  '/checkedInAppointments/:today',
  ensureAuthenticated,
  dashboardController.getCheckedInAppointments
);
router.put(
  '/lateCancel',
  ensureAuthenticated,
  dashboardController.cancelAppointment
);
router.put('/checkIn', ensureAuthenticated, dashboardController.checkIn);
router.post(
  '/addAppointment',
  ensureAuthenticated,
  dashboardController.addAppointment
);
router.delete(
  '/deleteAppointment',
  ensureAuthenticated,
  dashboardController.deleteAppointment
);

module.exports = router;
