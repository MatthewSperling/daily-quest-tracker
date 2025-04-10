require('dotenv').config();
const express = require('express');
const session = require('express-session');
// const csrf = require('csurf');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoose = require('mongoose');
const path = require('path');
const { body, validationResult } = require('express-validator');
const { encrypt } = require('./cryptoUtils'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('./public/Data/userdata.js');


const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// login post methd
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name || user.username, 
      email: user.email || `${user.username}@example.com`, 
      role: user.role
    },
    process.env.SESSION_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Logged in successfully', token });
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set security headers
app.use(helmet());
// Parse request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    secure: process.env.NODE_ENV === 'production', // true in production with HTTPS
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 15 // 15 minutes
  }
}));

// Setup CSRF protection
// const csrfProtection = csrf();
// app.use(csrfProtection);
// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken(); // expose CSRF token for forms
//   next();
// });

// Rate limiter for login attempts
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 attempts per IP
  message: "Too many login attempts, try again after 15 minutes"
});

// Login route with rate limiting and session regeneration
// app.post('/login', loginLimiter, (req, res) => {
//   const { username, password } = req.body;
//   // Validate credentials (demo: fixed values)
//   if (username === 'testuser' && password === 'password123') {
//     req.session.regenerate(err => {
//       if (err) return res.status(500).json({ error: 'Session regeneration failed' });
//       req.session.user = { username: 'testuser', role: 'user' };
//       res.json({ message: 'Logged in successfully', csrfToken: res.locals.csrfToken });
//     });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

app.post('/login', loginLimiter, (req, res) => {
  const { username, password } = req.body;

  if (username === 'testuser' && password === 'password123') {
    const token = jwt.sign(
      { username: 'testuser', role: 'user' },
      process.env.SESSION_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// Protected dashboard route
// app.get('/dashboard', (req, res) => {
//   if (req.session.user) {
//     res.send(`
//       <h1>Welcome ${req.session.user.username}</h1>
//       <form method="POST" action="/logout">
//         <input type="hidden" name="_csrf" value="${res.locals.csrfToken}">
//         <button type="submit">Logout</button>
//       </form>
//     `);
//   } else {
//     res.redirect('/login.html');
//   }
// });
const { authenticateToken } = require('./middleware');

app.get('/dashboard', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  res.render('dashboard', { user });
});

// method to update dashboard
app.post('/dashboard/update',
  authenticateToken,
  body('name').trim().isLength({ min: 3, max: 50 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('bio').trim().isLength({ max: 500 }).matches(/^[A-Za-z0-9 .,!?'"\-\n\r]*$/),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send('Validation failed');
    }

    const { name, email, bio } = req.body;
    const user = users.find(u => u.id === req.user.id); 

    if (!user) {
      return res.status(404).send('User not found');
    }
    res.redirect('/dashboard');
  }
);


// Logout route to destroy session
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
