const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const heartCostSchema = new Schema({
  costPerHeart: { type: Number, required: true } // Cost of one heart
});

module.exports = mongoose.model('HeartCost', heartCostSchema);
