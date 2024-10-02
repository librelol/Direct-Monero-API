const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure User is properly imported
const Post = require('../models/post'); // Ensure Post is properly imported
const authenticateToken = require('../middleware/authenticateToken'); // Ensure authenticateToken is properly imported
const isSeller = require('../middleware/isSeller'); // Ensure isSeller is properly imported
const multer = require('multer'); // Import multer
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the destination directory for uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Specify the filename format
    }
});

const upload = multer({ storage });

// Create a new post with image upload
router.post('/create_post', authenticateToken, isSeller, upload.single('image'), async (req, res) => {
    const { title, productDescription, price, amountPerPrice, unitAmount, onSale } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get the image path if an image is uploaded

    // Validate the input
    if (!title || !price || !amountPerPrice || !unitAmount) {
        return res.status(400).json({ message: 'Title, price, amount per price, and unit amount are required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new post
        const newPost = new Post({
            title,
            productDescription,
            price,
            amountPerPrice,
            unitAmount,
            authorId: user._id,
            imageUrl,
            onSale
        });

        // Save the post to the database
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update an existing post with image upload
router.put('/update_post/:id', authenticateToken, isSeller, upload.single('image'), async (req, res) => {
    const { title, productDescription, price, amountPerPrice, unitAmount, onSale } = req.body;
    const imageUrl = req.file ? req.file.path : null; // Get the image path if an image is uploaded

    // Validate the input
    if (!title || !price || !amountPerPrice || !unitAmount) {
        return res.status(400).json({ message: 'Title, price, amount per price, and unit amount are required' });
    }

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user is the author of the post
        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to update this post' });
        }

        // Update the post fields
        post.title = title;
        post.productDescription = productDescription;
        post.price = price;
        post.amountPerPrice = amountPerPrice;
        post.unitAmount = unitAmount;
        post.imageUrl = imageUrl || post.imageUrl; // Update the image URL if a new image is uploaded
        post.onSale = onSale;

        // Save the updated post to the database
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an existing post
router.delete('/delete_post/:id', authenticateToken, isSeller, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if the authenticated user is the author of the post
        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        // Delete the post from the database
        await post.remove();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;