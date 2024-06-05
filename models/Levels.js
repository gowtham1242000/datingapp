const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const levelsSchema = new mongoose.Schema({
  levelname: { type: String, required: true, unique: true },
  textcode: { type: String, required: true,unique: true },
  bgCode: { type: String, required: true,unique: true },
  viewOrder:{ type: String, required: true,unique: true },
}, { timestamps: true });


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
