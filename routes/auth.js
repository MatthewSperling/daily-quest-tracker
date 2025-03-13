const express = require('express');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');
const authRoutes = require('./routes/auth');
require('./config/passport'); // Ensure Passport is configured

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION,
    collectionName: 'sessions',
  }),
  cookie: {
    httpOnly: true,
    secure: false, // Set to true in production (requires HTTPS)
    maxAge: 1000 * 60 * 15, // 15 minutes session expiry
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Authentication System</h1>');
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Debugging Information
console.log("\n--- Debugging ---");
console.log("Trying to implement login and session authentication using Passport.js.");
console.log("We encountered an issue where the login does not maintain session state, meaning users may not stay logged in after authentication.");
console.log("Possible issues:");
console.log("1. Missing Passport serialization and deserialization in ./config/passport.");
console.log("2. Session store not persisting correctly.");
console.log("3. Express-session might not be configured properly with MongoDB.");
console.log("4. Login callback might not be redirecting or responding correctly.");
console.log("5. req.user might not be persisting between requests.");
console.log("Next Steps: Verify session setup and debug Passport configurations.");
