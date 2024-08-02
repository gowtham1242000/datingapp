const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  otp: {
    code: { type: Number, required: true },
    expiresAt: { type: Date, required: true }
  },
  profile: {
    age: Number,
    gender: String,
    dateOfBirth: Date,
    language: String,
    place: String,
    myMood: String,
    moodName: String,
    pointsEarned: { type: Number, default: 0 },
    walletBalance: { type: Number, default: 0 },
    heartBalance: { type: Number, default: 0 },
    coin: { type: Number, default: 0 },
    gifts: { type: Number, default: 0 },
    avatar: String
  },
}, { timestamps: true });

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP as a number
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  this.otp = { code: otp, expiresAt };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otp || !this.otp.expiresAt || this.otp.expiresAt < Date.now()) {
    return false; // OTP expired or not set
  }
  return this.otp.code === parseInt(candidateOTP, 10); // Ensure candidateOTP is compared as a number
};

const User = mongoose.model('User', userSchema);

module.exports = User;
