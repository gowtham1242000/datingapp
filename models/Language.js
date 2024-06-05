const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    language: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true },
    details: {
        gender: String,
        dateOfBirth: Date,
        language: String,
        place: String,
        coin: Number,
        avatar: String
      },
}, { timestamps: true });



const Language = mongoose.model('Language', languageSchema);

module.exports = Language;