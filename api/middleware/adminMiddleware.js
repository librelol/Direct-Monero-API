const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/env');
const User = require('../models/user');

const adminUsernames = ['admin'];

const isAdmin = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (user && adminUsernames.includes(user.username)) {
      req.user = user;
      next();
    } else {
      res.status(403).json({ message: 'User is not an administrator' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = isAdmin;