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
    req.session.user = { id: req.user.id, username: req.user.username, role: req.user.role };

    return res.redirect("../quest.html");
});



module.exports = router;
