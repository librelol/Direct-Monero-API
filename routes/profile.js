const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const { apiLimiter } = require('../middleware/rateLimiter');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

const router = express.Router();

// Endpoint to retrieve the current logged-in user's username, public key, and display name
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send back the username, public key, and display name
    res.json({ 
      public_key: user.public_key || null, // Return public_key, default to null if not set
      displayName: user.displayName || null // Return displayName, default to null if not set
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to change the display name
router.post('/change_display_name', authenticateToken, async (req, res) => {
  const { displayName } = req.body;

  // Validate the display name format
  if (!displayName || typeof displayName !== 'string' || displayName.length > 50) {
    return res.status(400).json({ message: 'Invalid display name format' });
  }

  // Check if the display name contains at least 4 numbers
  const numberCount = (displayName.match(/\d/g) || []).length;
  if (numberCount < 4) {
    return res.status(400).json({ message: 'Display name must contain at least 4 numbers' });
  }

  // Check if the display name contains more than 2 letters
  const letterCount = (displayName.match(/[a-zA-Z]/g) || []).length;
  if (letterCount < 2) {
    return res.status(400).json({ message: 'Display name must contain more than 2 letters' });
  }

  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.displayName = displayName; // Update the user's display name
    await user.save(); // Save changes to the database

    res.json({ message: 'Display name updated successfully' });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

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

module.exports = router;