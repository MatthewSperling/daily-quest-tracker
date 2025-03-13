// app.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');
const { authenticateToken, authorizeRole } = require("./middleware");

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup (adjust cookie settings for production)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_random_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set secure: true in production (requires HTTPS)
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport'); // load passport configuration

// Local Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Google SSO Routes
const googleAuthRoutes = require('./routes/googleAuth');
app.use('/auth', googleAuthRoutes);

// Serve static assets from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Protected route: Quest Page (accessible only when logged in)
app.get('/quest.html', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, 'public', 'quest.html'));
  } else {
    res.redirect('/index.html');
  }
});

// Protected Routes
app.get("/profile", authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}!`, role: req.user.role });
});

app.get("/admin", authenticateToken, authorizeRole("Admin"), (req, res) => {
  res.json({ message: "Welcome Admin! Only admins can access this page." });
});

// Root route: Redirect based on authentication status
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect('/quest.html');
  } else {
    res.redirect('/index.html');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
