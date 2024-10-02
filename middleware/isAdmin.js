const jwt = require('jsonwebtoken');
const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY || require('crypto').randomBytes(64).toString('hex');

const adminUsernames = ['admin'];

const isAdmin = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    try {
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
  });
};

module.exports = isAdmin;