const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as necessary
const SECRET_KEY = process.env.SECRET_KEY || require('crypto').randomBytes(64).toString('hex');

const isAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, async (err, decoded) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to authenticate token' });
    }

    try {
      const user = await User.findById(decoded.id);
      if (user && (user.role === 'admin' || user.username === 'admin')) { // Check role or username
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