// models/CoinOfferBanner.js
const mongoose = require('mongoose');

const coinOfferBannerSchema = new mongoose.Schema({
    coin: { type: Number, required: true },
    rateInInr: { type: Number, required: true },
    text: { type: String, required: true },
    status: { type: String, required: true },
    bannerImage: { type: String, required: true },
//    thumbnailImage: { type: String, required: true },
    viewingOrder: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CoinOfferBanner', coinOfferBannerSchema);
