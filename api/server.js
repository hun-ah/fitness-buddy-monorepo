/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nocache = require('nocache');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Route variables
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const logoutRoutes = require('./routes/logout');
const dashboardRoutes = require('./routes/dashboard');

// Passport & env
require('./config/passport')(passport);
require('dotenv').config({ path: './config/.env' });

// Middleware
app.use(nocache());
app.use(
  cors({ origin: 'https://fitness-buddy-hwm.cyclic.app', credentials: true })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Sessions
app.use(
  session({
    secret: process.env.SECRET,
    cookie: {
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
    proxy: true,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/register', registerRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/logout', logoutRoutes);
app.use('/api/dashboard', dashboardRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
