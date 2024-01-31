/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  membershipType: {
    type: String,
    required: true,
  },
  sessions: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  coachId: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Client = mongoose.model('Client', ClientSchema);

module.exports = Client;
