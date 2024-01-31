/* eslint-disable no-undef */
const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientId: {
    type: String,
    required: true,
  },
  appointmentDate: {
    type: String,
    required: true,
  },
  appointmentStart: {
    type: String,
    required: true,
  },
  appointmentEnd: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  lateCancel: {
    type: Boolean,
    required: true,
  },
  checkedIn: {
    type: Boolean,
    required: true,
  },
  coachId: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
