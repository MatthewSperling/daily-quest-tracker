// routes/googleAuth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Initiate Google OAuth authentication
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Handle the Google OAuth callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication: redirect to a protected route or dashboard
    res.redirect('/dashboard');
});

module.exports = router;
