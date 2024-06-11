// models/Wallpaper.js
const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
    image: { type: String, required: true },
    thumbnailImg: { type: String, required: true}
});

module.exports = mongoose.model('Avatar', avatarSchema);

