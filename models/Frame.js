// models/Frame.js
const mongoose = require('mongoose');

const frameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    oldPrice: { type: Number, required: true },
    newPrice: { type: Number, required: true },
    image: { type: String, required: true },
    thumbnail: { type: String, required: true },
    viewOrder: { type: Number, required: true },
    status: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Frame', frameSchema);

