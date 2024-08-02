const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlockSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  blockedUserId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  blockFlag: {
    type: Boolean,
    required: true,
    default: true
  },
  blockedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Block', BlockSchema);
