const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const User = require('../models/user');
const { SECRET_KEY } = require('../config/env');

const login = async (req, res) => {
  const { username, password } = req.body;

  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  try {
    const user = await User.findOne({ username: sanitizedUsername });
    if (user && await bcrypt.compare(sanitizedPassword, user.password)) {
      const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  const { username, password } = req.body;

  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  if (!validator.isAlphanumeric(sanitizedUsername) || sanitizedPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
  const newUser = new User({ username: sanitizedUsername, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user: ' + error.message });
  }
};

module.exports = { login, register };