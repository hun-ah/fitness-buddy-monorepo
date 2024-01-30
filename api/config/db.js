/* eslint-disable no-undef */
const mongoose = require('mongoose');
require('dotenv').config({ path: './config/.env' });

const dbConnectionStr = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dbConnectionStr);

    mongoose.set('strictQuery', false);

    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;
