/*const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    language: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true },
    details: {
//        gender: String,
  //      dateOfBirth: Date,
        language: String,
        place: String,
        coin: Number,
        avatar: String
      },
}, { timestamps: true });




const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
*/

const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    language: { type: String, required: true, unique: true },
    status: { type: Boolean, required: true },
    code: { type: String, required: true, unique: true },
    avatar: { type: String } // This field will store the path to the avatar image
}, { timestamps: true });

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;

