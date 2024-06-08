const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const freeCoinSchema = new Schema({
  freeCoinforNewUser: { type: Number, required: true },
  expireAfter: { type: Number, required: true },
  status: { type: Boolean, required: true, default: true }
});

const FreeCoin = mongoose.model('FreeCoin', freeCoinSchema);
module.exports = FreeCoin;
