const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileImage', required: false },
  last_seen: { type: Date, default: Date.now },
  displayName: { type: String, required: false },
  public_key: { type: String, required: false }
});

module.exports = mongoose.model('User', userSchema);