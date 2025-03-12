const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }, // Only used for local authentication
  email: { type: String, unique: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String } // For users registered via Google SSO
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
