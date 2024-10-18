const express = require('express');
const { addToCart, getCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have a middleware for authentication

const CartRoutes = express.Router();

// @route POST /api/cart
// @desc Add product to cart
// @access Private
router.post('/',  addToCart);

// @route GET /api/cart
// @desc Get user's cart
// @access Private
router.get('/',  getCart);

// @route DELETE /api/cart/:id
// @desc Remove product from cart
// @access Private
router.delete('/:id', removeFromCart);

// @route DELETE /api/cart
// @desc Clear cart after order
// @access Private
router.delete('/', protect, clearCart);

module.exports = CartRoutes;
