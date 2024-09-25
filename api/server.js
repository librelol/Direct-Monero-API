const express = require('express');
const cors = require('cors'); // Import cors
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const validator = require('validator'); // Import validator
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;
const SECRET_KEY = process.env.SECRET_KEY || 'this_is_backup'; // Use environment variable in production

// Static list of administrator usernames
const adminUsernames = ['admin'];

// Middleware to check if a user is an administrator
function isAdmin(req, res, next) {
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
}

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token' });
  }
};


// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// MongoDB connection
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbHost = 'mongodb'; // The service name defined in docker-compose.yml

const mongoURI = `mongodb://${dbUser}:${dbPassword}@${dbHost}:27017/${dbName}?authSource=admin`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// User schema and model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String, required: false },
  public_key: { type: String, required: false }
});

const User = mongoose.model('User', userSchema);

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Sanitize inputs
  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  console.log('Received request:', { username: sanitizedUsername });

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
});

// New endpoint to set the public key
app.post('/api/public_key', authenticateToken, async (req, res) => {
  const { public_key } = req.body;

  // Validate the public key format
  const pgpPublicKeyRegex = /^-----BEGIN PGP PUBLIC KEY BLOCK-----\n([\s\S]+?)\n-----END PGP PUBLIC KEY BLOCK-----\n$/;

  // Check if the public_key is a string and matches the PGP public key format
  if (!public_key || typeof public_key !== 'string' || !pgpPublicKeyRegex.test(public_key)) {
    return res.status(400).json({ message: 'Invalid public key format' });
  }

  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.public_key = public_key; // Update the user's public key
    await user.save(); // Save changes to the database

    res.json({ message: 'Public key updated successfully' });
  } catch (error) {
    console.error('Error updating public key:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// New endpoint to change the display name
app.post('/api/change_display_name', authenticateToken, async (req, res) => {
  const { displayName } = req.body;

  // Validate the display name format
  if (!displayName || typeof displayName !== 'string' || displayName.length > 50) {
    return res.status(400).json({ message: 'Invalid display name format' });
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



// Registration endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  // Sanitize inputs
  const sanitizedUsername = validator.escape(username);
  const sanitizedPassword = validator.escape(password);

  // Check for validation errors
  if (!validator.isAlphanumeric(sanitizedUsername) || sanitizedPassword.length < 6) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  const hashedPassword = await bcrypt.hash(sanitizedPassword, 10); // Hash the password
  const newUser = new User({ username: sanitizedUsername, password: hashedPassword });

  try {
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user: ' + error.message });
  }
});

// Endpoint to retrieve the current logged-in user's username, public key, and display name
app.get('/api/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send back the username, public key, and display name
    res.json({ 
      username: user.username, 
      public_key: user.public_key || null, // Return public_key, default to null if not set
      displayName: user.displayName || null // Return displayName, default to null if not set
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// New endpoint to change the password
app.post('/api/change_password', authenticateToken, async (req, res) => {
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

// Start the server
app.listen(PORT, () => {
  console.log(`API is running on port ${PORT}`);
});
