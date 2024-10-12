const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist } = require('../controllers/wishlistController');

// Wishlist routes
router.post('/:userId/wishlist', addToWishlist);
router.get('/:userId/wishlist', getWishlist);

module.exports = router;
