const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path as necessary
const SECRET_KEY = process.env.SECRET_KEY || require('crypto').randomBytes(64).toString('hex');

const isSeller = (req, res, next) => {
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
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (!user.isSeller) {
        return res.status(403).json({ message: 'Access denied: Not a seller' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });
};

module.exports = isSeller;