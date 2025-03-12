require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const helmet = require('helmet');
const passport = require('passport');
const path = require('path');

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

// Routes for local authentication
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Routes for Google SSO
const googleAuthRoutes = require('./routes/googleAuth');
app.use('/auth', googleAuthRoutes);

// Serve static files (if needed, e.g., front-end assets in a "public" folder)
app.use(express.static(path.join(__dirname, 'public')));

// A protected test route to verify authentication
app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello ${req.user.username}, welcome to your dashboard.`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
