const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    match: [/^[^\s@]+@mtrepoly\.edu$/, 'Please use a valid Mtre Poly email']
  },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    required: true,
    enum: ['admin', 'student'],
    default: 'student'
  },
  classLevels: [{
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
    level: { type: String, enum: ['NC', 'ND', 'HND'] }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);