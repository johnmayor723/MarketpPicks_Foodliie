const Cart = require('../models/Cart'); // Make sure the path is correct based on your project structure

// Add to Cart
const addToCart = async (req, res) => {
    const { product, qty, name, image, price } = req.body;
    const userId = req.params.userId; // Get userId from URL parameters

    try {
        const cart = await Cart.findOne({ user: userId }); // Find the cart by userId

        if (cart) {
            // Check if product exists in cart
            const productExists = cart.cartItems.find(item => item.product.toString() === product);

            if (productExists) {
                productExists.qty += qty; // If product exists, update the quantity
            } else {
                // If product doesn't exist, add the new product to the cart
                cart.cartItems.push({ product, qty, name, image, price });
            }

            await cart.save(); // Save the updated cart
            return res.json(cart);
        } else {
            // If cart doesn't exist, create a new one
            const newCart = new Cart({
                user: userId,
                cartItems: [{ product, qty, name, image, price }]
            });

            await newCart.save(); // Save the new cart
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Get Cart for a User
const getCart = async (req, res) => {
    const userId = req.params.userId; // Get userId from URL parameters

    try {
        const cart = await Cart.findOne({ user: userId }); // Find the cart by userId

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        return res.json(cart); // Return the cart
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Remove Item from Cart
const removeFromCart = async (req, res) => {
    const userId = req.params.userId; // Get userId from URL parameters
    const productId = req.params.id; // Get product id from URL parameters

    try {
        const cart = await Cart.findOne({ user: userId }); // Find the cart by userId

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.cartItems = cart.cartItems.filter(item => item.product.toString() !== productId);

        await cart.save(); // Save the updated cart
        return res.json(cart); // Return the updated cart
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Clear Cart for a User
const clearCart = async (req, res) => {
    const userId = req.params.userId; // Get userId from URL parameters

    try {
        const cart = await Cart.findOne({ user: userId }); // Find the cart by userId

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Clear all items from the cart
        cart.cartItems = [];

        await cart.save(); // Save the updated cart
        return res.json({ message: 'Cart cleared' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    clearCart
};
