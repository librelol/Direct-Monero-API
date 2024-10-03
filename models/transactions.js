const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    productDescription: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: true
    },
    amountPerPrice: {
        type: Number,
        required: true
    },
    unitAmount: {
        type: String,
        required: true
    },
    authorId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    onSale: {
        type: Boolean,
        default: false
    },
    post_reputation: {
        type: Number,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;