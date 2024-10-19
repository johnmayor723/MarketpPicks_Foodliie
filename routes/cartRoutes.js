const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');

// Add userId as a URL parameter
router.post('/:userId', addToCart);
router.get('/:userId', getCart); // Adjusted to get cart for a specific user
router.delete('/:userId/:id', removeFromCart); // Adjusted to remove from cart for a specific user
router.delete('/:userId', clearCart); // Adjusted to clear cart for a specific user

module.exports = router;
