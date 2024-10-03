const express = require('express');
const authenticateToken = require('../middleware/authenticateToken');
const User = require('../models/user');
const { apiLimiter } = require('../middleware/rateLimiter');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported
const multer = require('multer'); // Import multer for file uploads
const mongoose = require('mongoose');
const crypto = require('crypto');
const path = require('path');

const router = express.Router();

// Configure multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to retrieve the current logged-in user's username, public key, and display name
router.get('/me', authenticateToken, apiLimiter, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('profileImageId'); // Fetch user by ID and populate profile image ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Send back the username, public key, and display name
    res.json({ 
      public_key: user.public_key || null, // Return public_key, default to null if not set
      displayName: user.displayName || null, // Return displayName, default to null if not set
      profileImageId: user.profileImageId // Return profile image ID
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to change the display name
router.post('/change_display_name', authenticateToken, async (req, res) => {
  const { displayName } = req.body;

  // Validate the display name format
  if (!displayName || typeof displayName !== 'string' || displayName.length > 50) {
    return res.status(400).json({ message: 'Invalid display name format' });
  }

  // Check if the display name contains at least 4 numbers
  const numberCount = (displayName.match(/\d/g) || []).length;
  if (numberCount < 4) {
    return res.status(400).json({ message: 'Display name must contain at least 4 numbers' });
  }

  // Check if the display name contains more than 2 letters
  const letterCount = (displayName.match(/[a-zA-Z]/g) || []).length;
  if (letterCount < 2) {
    return res.status(400).json({ message: 'Display name must contain more than 2 letters' });
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

// New endpoint to set the public key
router.post('/public_key', authenticateToken, async (req, res) => {
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

// Endpoint to set the profile image
router.post('/profile_image', authenticateToken, upload.single('profileImage'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a unique filename
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return res.status(500).send('Error generating filename.');
      }
      const filename = buf.toString('hex') + path.extname(req.file.originalname);

      // Create a write stream to GridFS
      const writeStream = global.gfs.createWriteStream({
        _id: new mongoose.Types.ObjectId(),
        filename: filename,
        content_type: req.file.mimetype,
      });

      // Write the file buffer to GridFS
      writeStream.write(req.file.buffer);
      writeStream.end();

      writeStream.on('close', async (file) => {
        // Update the user's profileImageId
        user.profileImageId = file._id;
        await user.save(); // Save changes to the database

        res.json({ message: 'Profile image updated successfully', profileImageUrl: `/api/profile/image/${file.filename}` });
      });

      writeStream.on('error', (err) => {
        res.status(500).send('Error uploading file.');
      });
    });
  } catch (error) {
    console.error('Error updating profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Endpoint to get the profile image by filename
router.get('/image/:filename', async (req, res) => {
  try {
    const conn = mongoose.connection;
    const gfs = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads',
    });

    const file = await gfs.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'No file exists' });
    }

    gfs.openDownloadStreamByName(req.params.filename).pipe(res);
  } catch (error) {
    console.error('Error fetching profile image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;