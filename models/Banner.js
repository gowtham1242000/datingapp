const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  image: { type: String, required: true },
  viewingOrder: { type: Number, required: true },
//  url: { type: String, required: true },
  status: { type: Boolean, required: true },
}, { timestamps: true });

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
