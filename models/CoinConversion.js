const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const coinHeartConversionSchema = new Schema({
  coins: { type: Number, required: true },
  hearts: { type: Number, required: true }
});

const heartConversionSchema = new Schema({
  hearts: { type: Number, required: true },
  indianRupees: { type: Number, required: true }
});


const referralsSchema = new Schema({
  coinPerReferreals: { type: Number, required: true }
});

const coinConversionSchema = new Schema({
  coinHeartConversionFactor: coinHeartConversionSchema,
  heartConversionFactor: heartConversionSchema,
  referrals: referralsSchema
}, { timestamps: true });

module.exports = mongoose.model('CoinConversion', coinConversionSchema);
