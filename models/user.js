const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String }, 
  email: { type: String, unique: true },
  role: { type: String, enum: ['User', 'Admin'], default: 'User' }, 
  googleId: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
