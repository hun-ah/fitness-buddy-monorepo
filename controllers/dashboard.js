/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const User = require('../models/User');
const Client = require('../models/Client');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcrypt');
const cloudinary = require('../middleware/cloudinary');

module.exports = {
  /****** USER ******/
  getDashboard: (req, res) => {
    return res
      .status(200)
      .json({ message: 'User is authenticated', user: req.user });
  },
  updateProfile: async (req, res) => {
    const updatedData = req.body;
    const updatedPassword = updatedData.password;

    try {
      const userId = req.user.id;

      const email = await User.findOne({ email: updatedData.email });

      if (email) {
        return res
          .status(409)
          .json({ error: 'Email is already registered to a user' });
      }

      if (updatedPassword) {
        bcrypt.genSalt(10, async (err, salt) => {
          try {
            const hash = await bcrypt.hash(updatedPassword, salt);
            updatedData.password = hash;

            const user = await User.findByIdAndUpdate(
              userId,
              { $set: updatedData },
              { new: true }
            );

            res.status(200).json({ success: true, user });
          } catch (hashError) {
            res.status(500).json({ success: false, error: hashError.message });
          }
        });
      } else {
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: updatedData },
          { new: true }
        );

        res.status(200).json({ success: true, user });
      }
    } catch (err) {
      res.status(500).json({ success: false, error: err.message });
    }
  },
  updateAvatar: async (req, res) => {
    try {
      const userId = req.user.id;
      const result = await cloudinary.uploader.upload(req.file.path);

      const update = await User.findByIdAndUpdate(userId, {
        avatar: result.secure_url,
        cloudinaryId: result.public_id,
      });

      return res
        .status(200)
        .json({ message: 'Update successful', imgLink: result.secure_url });
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  },
  deleteUser: async (req, res) => {
    const userId = req.user.id;

    try {
      await Client.deleteMany({ coachId: userId });

      const user = await User.findByIdAndDelete(userId);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },
  /****** CLIENTS ******/
  updateClientAvatar: async (req, res) => {
    const clientId = req.body.clientId;

    try {
      const result = await cloudinary.uploader.upload(req.file.path);

      const update = await Client.findByIdAndUpdate(clientId, {
        avatar: result.secure_url,
        cloudinaryId: result.public_id,
      });

      return res
        .status(200)
        .json({ message: 'Update successful', imgLink: result.secure_url });
    } catch (err) {
      console.log(err);
      return res.status(500);
    }
  },
  addClient: async (req, res) => {
    const {
      firstName,
      lastName,
      phone,
      email,
      membershipType,
      sessions,
      active,
    } = req.body;

    const client = await Client.findOne({ email: email });

    if (client) {
      return res.status(409).json({ error: 'Client already exists' });
    } else {
      const coachId = req.user.id;

      const newClient = new Client({
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        phone: phone,
        email: email.toLowerCase(),
        membershipType,
        sessions,
        active,
        coachId,
      });

      try {
        newClient.save();
        console.log(newClient);
        return res.status(201).json({ message: 'User created', newClient });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error saving client' });
      }
    }
  },
  getClients: async (req, res) => {
    const coachId = req.user.id;

    try {
      const clients = await Client.find({ coachId });
      return res.status(200).json({ clients });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error getting clients' });
    }
  },
  getClient: async (req, res) => {
    const clientId = req.params.clientId;

    try {
      const client = await Client.findOne({ _id: clientId });
      return res.status(200).json({ client });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error getting client' });
    }
  },
  updateClient: async (req, res) => {
    const updatedData = req.body;
    const clientId = req.body.id;

    try {
      const email = await Client.findOne({ email: updatedData.email });

      if (email) {
        return res
          .status(409)
          .json({ error: 'Email is already registered to a user' });
      }

      const client = await Client.findOneAndUpdate(
        { _id: clientId },
        { $set: updatedData },
        { new: true }
      );
      console.log(client);
      return res.status(200).json({ success: true, client });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
  deleteClient: async (req, res) => {
    const clientId = req.body.id;

    try {
      const client = await Client.findOneAndDelete({ _id: clientId });
      return res.status(200).json({ success: true, client });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },
  /****** APPOINTMENTS ******/
  addAppointment: async (req, res) => {
    const {
      clientName,
      clientId,
      date,
      appointmentStart,
      appointmentEnd,
      duration,
      lateCancel,
      checkedIn,
    } = req.body;
    const coachId = req.user.id;

    const appointment = new Appointment({
      clientName,
      clientId,
      appointmentDate: date,
      appointmentStart,
      appointmentEnd,
      coachId,
      duration,
      lateCancel,
      checkedIn,
    });

    const client = await Client.findById(clientId);
    console.log(appointment);
    if (client.sessions < 1) {
      return res.status(201).json({ message: 'Client is out of sessions' });
    } else {
      try {
        await appointment.save();
        console.log(appointment);
        return res
          .status(200)
          .json({ message: 'Appointment added', appointment });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Error adding appointment' });
      }
    }
  },
  getAppointments: async (req, res) => {
    const coachId = req.user.id;

    try {
      const appointments = await Appointment.find({
        coachId,
      });
      return res.status(200).json({ appointments });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error getting appointments' });
    }
  },
  getSelectedAppointments: async (req, res) => {
    const coachId = req.user.id;
    const selectedDate = req.params.selectedDate;

    try {
      const appointments = await Appointment.find({
        coachId,
        appointmentDate: selectedDate,
      });
      return res.status(200).json({ appointments });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Error getting appointments' });
    }
  },
  getCheckedInAppointments: async (req, res) => {
    const coachId = req.user.id;
    const todaysDate = req.params.today;

    try {
      const appointments = await Appointment.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                {
                  $eq: [{ $substr: ['$appointmentDate', 0, 7] }, todaysDate],
                },
                { $eq: ['$checkedIn', true] },
                { $eq: ['$coachId', coachId] },
              ],
            },
          },
        },
      ]);

      return res.status(200).json({ appointments });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: 'Error getting checked in appointments' });
    }
  },
  deleteAppointment: async (req, res) => {
    const appointmentId = req.body.id;

    try {
      const appointment = await Appointment.findOneAndDelete({
        _id: appointmentId,
      });
      return res.status(200).json({ success: true, appointment });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ success: false, error: err.message });
    }
  },
  cancelAppointment: async (req, res) => {
    const { appointmentId, clientId } = req.body;

    try {
      await Client.findOneAndUpdate(
        { _id: clientId },
        { $inc: { sessions: -1 } },
        { new: true }
      );

      const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId },
        { lateCancel: true },
        { new: true }
      );

      return res.status(200).json({ success: true, appointment });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
  checkIn: async (req, res) => {
    const { appointmentId, clientId } = req.body;

    try {
      await Client.findOneAndUpdate(
        { _id: clientId },
        { $inc: { sessions: -1 } },
        { new: true }
      );

      const appointment = await Appointment.findOneAndUpdate(
        { _id: appointmentId },
        { checkedIn: true },
        { new: true }
      );

      return res.status(200).json({ success: true, appointment });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message });
    }
  },
};
