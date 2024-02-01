/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const nocache = require('nocache');
const app = express();
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 3000;
// run NODE_ENV=development node server.js to start in dev
const isDevelopment = process.env.NODE_ENV === 'development';

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
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// development vs. production CORS/cookie options
isDevelopment &&
  app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

const developmentCookie = {
  SameSite: 'none',
  Secure: 'false',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const productionCookie = {
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Sessions
app.use(
  session({
    secret: process.env.SECRET,
    cookie: isDevelopment ? developmentCookie : productionCookie,
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

app.use(express.static(path.join(__dirname, './client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './client/dist/index.html'));
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
});
