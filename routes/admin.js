const express = require('express');
const router = express.Router();
const User = require('../models/user');
const isAdmin = require('../middleware/isAdmin');

// Endpoint to adjust if a user is a seller or not
router.put('/adjust_seller/:id', isAdmin, async (req, res) => {
  const { isSeller } = req.body;

  if (typeof isSeller !== 'boolean') {
    return res.status(400).json({ message: 'isSeller must be a boolean' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isSeller = isSeller;
    await user.save();

    res.status(200).json({ message: 'User seller status updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to list all users
router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '_id username name email isSeller'); // Adjust the fields as necessary
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;