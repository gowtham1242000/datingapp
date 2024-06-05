const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },

  mobileNumber: { type: String, required: true, unique: true },
  otp: {
    code: String,
    expiresAt: Date
  },
  //password: { type: String, required: true },
  profile: {
    age: Number,
    gender: String,
    dateOfBirth: Date,
    language: String,
    place: String,
    coin: Number,
    avatar: String
  },
},
{ timestamps: true });

// Method to generate OTP
userSchema.methods.generateOTP = function() {
  const otp = crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit OTP
  const expiresAt = new Date(Date.now() + 1 * 60 * 1000); // OTP valid for 10 minutes
  this.otp = { code: otp, expiresAt };
  return otp;
};

// Method to verify OTP
userSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otp || !this.otp.expiresAt || this.otp.expiresAt < Date.now()) {
    return false; // OTP expired or not set
  }
  return this.otp.code === candidateOTP;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
