const User = require('../models/userModel');
const Product = require('../models/productModel');

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({ message: 'Product added to wishlist', wishlist: user.wishlist });
        } else {
            return res.status(400).json({ message: 'Product is already in the wishlist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get wishlist
const getWishlist = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId).populate('wishlist');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    addToWishlist,
    getWishlist,
};
