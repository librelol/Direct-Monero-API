const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Ensure User is properly imported
const Post = require('../models/post'); // Ensure Post is properly imported
const authenticateToken = require('../middleware/authenticateToken'); // Ensure authenticateToken is properly imported
const isSeller = require('../middleware/isSeller'); // Ensure isSeller is properly imported

// Create a new post
router.post('/create_post', isSeller, async (req, res) => {
    const { title, productDescription, price, amountPerPrice, unitAmount, onSale } = req.body;

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
            onSale
        });

        // Save the post to the database
        await newPost.save();

        res.status(201).json({ message: 'Post created successfully', post: newPost });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update an existing post
router.put('/update_post/:id', isSeller, async (req, res) => {
    const { title, productDescription, price, amountPerPrice, unitAmount, onSale } = req.body;

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
        post.onSale = onSale;

        // Save the updated post to the database
        await post.save();

        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete an existing post
router.delete('/delete_post/:id', isSeller, async (req, res) => {
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

// Retrieve posts created by the authenticated user
router.get('/my_posts', authenticateToken, async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.user.id });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to retrieve top posts
router.get('/top-posts', authenticateToken, async (req, res) => {
    try {
      // Fetch all posts
      const posts = await Post.find();
  
      // Fetch all users
      const users = await User.find();
  
      // Create a map of userId to sellerReputation
      const userReputationMap = users.reduce((map, user) => {
        map[user._id] = user.sellerReputation;
        return map;
      }, {});
  
      // Combine post reputation and seller reputation
      const combinedReputationPosts = posts.map(post => {
        const sellerReputation = userReputationMap[post.authorId] || 0;
        return {
          ...post._doc,
          combinedReputation: post.post_reputation + sellerReputation
        };
      });
  
      // Sort posts by combined reputation in descending order
      combinedReputationPosts.sort((a, b) => b.combinedReputation - a.combinedReputation);
  
      // Return the sorted posts
      res.json(combinedReputationPosts);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;