// models/UserOneVsOneList.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOneVsOneListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true },
  isHost: { type: Boolean, required: true }, // true if user is hosting the room, false if connected
  category: { type: String, required: true }, // category of the room
  connectedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('UserOneVsOneList', userOneVsOneListSchema);
