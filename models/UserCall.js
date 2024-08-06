
// models/UserCall.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userCallSchema = new Schema({
  hostId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  joinerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  callType: { type: String, required: true, enum: ['audio', 'video'] },
  channelName: { type: String, required: true },
  roomId: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  //endTime: { type: Date },
//  callEndedAt: { type: Date },  
//  callEnded: {type: Date, default: Date.now},
});

module.exports = mongoose.model('UserCall', userCallSchema);
