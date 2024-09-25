const User = require('../models/user');
const bcrypt = require('bcrypt'); // Make sure bcrypt is imported


const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('profileImageId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ 
      username: user.username, 
      public_key: user.public_key || null, 
      displayName: user.displayName || null, 
      profileImageId: user.profileImageId 
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changeDisplayName = async (req, res) => {
  const { displayName } = req.body;

  if (!displayName || typeof displayName !== 'string' || displayName.length > 50) {
    return res.status(400).json({ message: 'Invalid display name format' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.displayName = displayName;
    await user.save();

    res.json({ message: 'Display name updated successfully' });
  } catch (error) {
    console.error('Error updating display name:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'New password must be at least 6 characters long' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { getCurrentUser, changeDisplayName, changePassword };