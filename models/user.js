// models/user.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 },
  maxDistTravelled: { type: Number, default: 0 },
  lastOneDistTravelled: { type: Number, default: 0 },
  lastTwoDistTravelled: { type: Number, default: 0 },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
