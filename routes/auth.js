const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const User = require('../models/User');

// Local Registration
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }
    // Hash password using Argon2
    const hashedPassword = await argon2.hash(password);
    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Local Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Verify the provided password
    const isValid = await argon2.verify(user.password, password);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Log the user in using session-based authentication
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err });
      }
      return res.status(200).json({ message: "Login successful" });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Forgot Password (stub implementation)
router.post('/forgot-password', async (req, res) => {
  // In a real application, generate a secure, time-limited token, store it,
  // and email the user a password reset link.
  const { email } = req.body;
  // Stub: Respond as if the email was sent.
  res.status(200).json({ message: "Password reset link has been sent to your email (stub)" });
});

// Reset Password (stub implementation)
router.post('/reset-password', async (req, res) => {
  // In a real application, verify the reset token and update the password.
  const { token, newPassword } = req.body;
  // Stub: Respond as if the password was reset.
  res.status(200).json({ message: "Password has been reset (stub)" });
});

module.exports = router;
