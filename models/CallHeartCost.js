const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const callHeartCostSchema = new Schema({
  callHeartCost: { type: Number, required: true } // Cost of hearts per minute
});

module.exports = mongoose.model('CallHeartCost', callHeartCostSchema, 'call_heart_costs');
