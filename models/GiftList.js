// models/GiftList.js
const mongoose = require('mongoose');

const giftlistSchema = new mongoose.Schema({
    giftName: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
    viewOrder: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('GiftList', giftlistSchema);

