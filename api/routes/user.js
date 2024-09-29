const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const { apiLimiter } = require('../middleware/rateLimiter');
const crypto = require('crypto');
const validator = require('validator');

const router = express.Router();

// New endpoint to set the public key
router.post('/public_key', authenticateToken, async (req, res) => {
  const { public_key } = req.body;

  // Validate the public key format
  const pgpPublicKeyRegex = /^-----BEGIN PGP PUBLIC KEY BLOCK-----\n([\s\S]+?)\n-----END PGP PUBLIC KEY BLOCK-----\n$/;

  // Check if the public_key is a string and matches the PGP public key format
  if (!public_key || typeof public_key !== 'string' || !pgpPublicKeyRegex.test(public_key)) {
    return res.status(400).json({ message: 'Invalid public key format' });
  }

  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.public_key = public_key; // Update the user's public key
    await user.save(); // Save changes to the database

    res.json({ message: 'Public key updated successfully' });
  } catch (error) {
    console.error('Error updating public key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Function to generate a random display name
const generateRandomDisplayName = () => {
  const adjectives = ['Brave', 'Clever', 'Witty', 'Bold', 'Swift'];
  const nouns = ['Lion', 'Eagle', 'Shark', 'Panther', 'Wolf'];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumbers = Math.floor(1000 + Math.random() * 9000); // Generate 4 random numbers
  return `${adjective}${noun}${crypto.randomBytes(2).toString('hex')}${randomNumbers}`;
};

module.exports = router;