const mongoose = require('mongoose');

const coinTransactionHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for sharing scenario
  toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional for sharing scenario
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gift' }, // Optional for gift-related transactions
  type: { type: String, enum: ['spend', 'earn'], required: true },
  coins: { type: Number, required: true },
  amountInCurrency: { type: Number, required: true },
  description: { type: String },
  spendingType: { type: String, required: true }, // Type of spending scenario
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

const CoinTransactionHistory = mongoose.model('CoinTransactionHistory', coinTransactionHistorySchema);

module.exports = CoinTransactionHistory;
