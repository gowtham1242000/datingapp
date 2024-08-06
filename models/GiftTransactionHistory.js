// models/TransactionHistory.js
const mongoose = require('mongoose');

const GiftTransactionHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftList', required: true },
    giftName: { type: String, required: true },
   coinAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GiftTransactionHistory', GiftTransactionHistorySchema);
