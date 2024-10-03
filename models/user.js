const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  last_seen: { type: Date, default: Date.now },
  displayName: { type: String, required: true },
  public_key: { type: String, required: false },
  isSeller: { type: Boolean, default: false },
  buyerReputation: { type: Number, default: 0 },
  sellerReputation: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  role: { type: String, default: 'user' } // Add role field
});

module.exports = mongoose.model('User', userSchema);