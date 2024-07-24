// models/Frame.js
const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
    moodName: { type: String, required: true },
    image: { type: String, required: true },
//    thumbnail: { type: String, required: true },
    order: { type: Number, required: true },
    status: { type: Boolean, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mood', moodSchema);

