const mongoose = require('mongoose');

const coinPackageSchema = new mongoose.Schema({
  coin: { type: Number, required: true },
  rateInInr: { type: Number, required: true },
  //image: { type: String, required: true },
  text: { type: String },
  status: { type: Boolean, default: true } // Default status set to true
});

const CoinPackage = mongoose.model('CoinPackage', coinPackageSchema);

module.exports = CoinPackage;

