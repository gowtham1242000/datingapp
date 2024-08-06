// models/UserOneVsOneList.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userOneVsOneListSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: String, required: true },
  isHost: { type: Boolean, required: true }, // true if user is hosting the room, false if connected
  category: { type: String, required: true }, // category of the room
  callType: { type: String, required: true, enum: ['audio', 'video'] }, // type of call: audio or video
  channelName: { type: String },
  connectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserOneVsOneList', userOneVsOneListSchema);
