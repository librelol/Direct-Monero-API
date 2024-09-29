const mongoose = require('mongoose');
const { post } = require('../routes/auth');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImageId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProfileImage', required: false },
  last_seen: { type: Date, default: Date.now },
  displayName: { type: String, required: true },
  public_key: { type: String, required: false },
  isSeller: { type: Boolean, default: false },
  buyerReputation: { type: Number, default: 0 },
  sellerReputation: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);