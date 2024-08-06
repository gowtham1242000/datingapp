// models/GiftTransactionHistory.js
const mongoose = require('mongoose');

const giftTransactionHistorySchema = new mongoose.Schema({
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftList', required: true },
    giftName: { type: String, required: true },
    amount: { type: Number, required: true },
    coinAmount: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    quantity: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('GiftTransactionHistory', giftTransactionHistorySchema);
