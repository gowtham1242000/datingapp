const mongoose = require('mongoose');

const initialCoinSchema = new mongoose.Schema({
    coin: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now }
});

const InitialCoin = mongoose.model('InitialCoin', initialCoinSchema);

module.exports = InitialCoin;
