const Product = require('../models/Products');

// Get products by category
const categoryController = async (req, res) => {
    try {
        const category = req.params.category;
        const products = await Product.find({ category: category });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: 'No products found in this category' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    categoryController,
};
