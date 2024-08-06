const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartConversionHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  heartsConverted: { type: Number, required: true },
  amountReceived: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeartConversionHistory', heartConversionHistorySchema);
