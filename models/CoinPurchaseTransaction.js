const mongoose = require('mongoose');

const coinPurchaseTransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  amount: { type: Number, required: true },
  coinsPurchased: { type: Number, required: true },
  transactionDate: { type: Date, default: Date.now },
  transactionId: { type: String, required: true, unique: true }, // Unique ID for the transaction
  status: { type: String, required: true } // e.g., 'completed', 'pending'
});

module.exports = mongoose.model('CoinPurchaseTransaction', coinPurchaseTransactionSchema);
