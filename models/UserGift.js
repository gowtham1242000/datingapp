// models/UserGift.js
const mongoose = require('mongoose');

const userGiftSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'TransactionHistory', required: true },
    giftId: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftList', required: true },
    giftName: { type: String, required: true },
    amount: { type: Number, required: true },
    coinAmount: { type: Number, required: true },
    date: { type: Date, required: true },
    count: { type: Number, required: true, default:0 }
}, { timestamps: true });

module.exports = mongoose.model('UserGift', userGiftSchema);
