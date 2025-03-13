require('dotenv').config();
const express = require('express');
const session = require('express-session');
const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

// Set security headers
app.use(helmet());

// Parse request bodies and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECTION || 'mongodb://127.0.0.1:27017/secure-session-example', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Configure session with secure cookie settings
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_random_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Change to true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15 // 15 minutes
  }
}));

// CSRF Protection (cookie-based)
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Middleware to send CSRF token in a cookie
app.use((req, res, next) => {
  res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false, secure: false, sameSite: 'lax' });
  next();
});

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again after 15 minutes"
});

// GET /register - Serve registration form
app.get('/register', (req, res) => {
  res.send(`
    <h1>Register</h1>
    <form method="POST" action="/api/auth/register">
      <input type="hidden" name="_csrf" value="${req.csrfToken()}">
      <input type="text" name="username" placeholder="Username" required>
      <input type="email" name="email" placeholder="Email" required>
      <input type="password" name="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>
  `);
});

// POST /register - Registration logic
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'User registered successfully' });
});

// POST /login - Regenerates CSRF token on login
app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;
  if (username === 'testuser' && password === 'password123') {
    req.session.regenerate(err => {
      if (err) return res.status(500).json({ error: 'Session regeneration failed' });
      req.session.user = { username: 'testuser', role: 'user' };
      res.cookie('XSRF-TOKEN', req.csrfToken(), { httpOnly: false, secure: false, sameSite: 'lax' });
      res.json({ message: 'Logged in successfully' });
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// GET /dashboard - Protected route
app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.send(`
      <h1>Welcome ${req.session.user.username}</h1>
      <form method="POST" action="/logout">
        <input type="hidden" name="_csrf" value="${req.csrfToken()}">
        <button type="submit">Logout</button>
      </form>
    `);
  } else {
    res.redirect('/index.html');
  }
});

// POST /logout - Destroy session
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Could not log out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
