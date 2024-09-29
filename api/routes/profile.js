const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const { apiLimiter } = require('../middleware/rateLimiter');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

const router = express.Router();

// Endpoint to retrieve the current logged-in user's username, public key, and display name
router.get('/me', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('profileImageId'); // Fetch user by ID and populate profile image ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send back the username, public key, and display name
    res.json({ 
      public_key: user.public_key || null, // Return public_key, default to null if not set
      displayName: user.displayName || null, // Return displayName, default to null if not set
      profileImageId: user.profileImageId // Return profile image ID
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

// Endpoint to change the password
router.post('/change_password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Validate the new password
  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the old password is correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    // Hash the new password and save it
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to delete the user's account
router.post('/delete_account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await User.findByIdAndDelete(req.user.id);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;