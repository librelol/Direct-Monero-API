const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const { apiLimiter } = require('../middleware/rateLimiter');
const crypto = require('crypto');
const validator = require('validator');

const router = express.Router();

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