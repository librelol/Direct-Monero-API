const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const User = require('../models/user');
const { loginLimiter } = require('../middleware/rateLimiter');
const authenticateToken = require('../middleware/authenticateToken');
const SECRET_KEY = process.env.SECRET_KEY || require('crypto').randomBytes(64).toString('hex');

const router = express.Router();

// Login endpoint
router.post('/login', loginLimiter, async (req, res) => {
  const { username, password } = req.body;

  // Sanitize inputs
  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  try {
    const user = await User.findOne({ username: sanitizedUsername });
    if (user && await bcrypt.compare(sanitizedPassword, user.password)) {
      // Update last_seen field
      user.last_seen = Date.now();
      await user.save();

      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// User registration endpoint
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validate the input
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Sanitize inputs
  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username: sanitizedUsername });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    // Create a new user with a random display name
    const newUser = new User({
      username: sanitizedUsername,
      password: hashedPassword,
      displayName: generateRandomDisplayName(), // Assign random display name
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user: ' + error.message });
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