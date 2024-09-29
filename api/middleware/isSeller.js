const User = require('../models/user'); // Adjust the path as necessary

const isSeller = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isSeller) {
            return res.status(403).json({ message: 'Access denied: Not a seller' });
        }

        next();
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = isSeller;