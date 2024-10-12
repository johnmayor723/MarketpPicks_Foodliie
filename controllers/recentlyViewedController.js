const User = require('../models/userModel');
const Product = require('../models/productModel');

// Add product to recently viewed
const addToRecentlyViewed = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.recentlyViewed.includes(productId)) {
            user.recentlyViewed.push(productId);
            await user.save();
            return res.status(200).json({ message: 'Product added to recently viewed', recentlyViewed: user.recentlyViewed });
        } else {
            return res.status(400).json({ message: 'Product is already in recently viewed' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get recently viewed
const getRecentlyViewed = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('recentlyViewed');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.recentlyViewed);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addToRecentlyViewed,
    getRecentlyViewed,
};
