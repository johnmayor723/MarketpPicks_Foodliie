require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { authMiddleware } = require('./middleware/authMiddleware');
const { adminMiddleware } = require('./middleware/adminMiddleware');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const recentlyViewedRoutes = require('./routes/recentlyViewedRoutes');

//initialise the app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors()); // Enable cross-origin resource sharing

// Connect to Database
const connectDB = require('./utils/database');
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', authMiddleware, orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/recentlyViewed', recentlyViewedRoutes);


// Admin-only routes (e.g., for CRUD operations on products)
app.use('/api/admin/products', authMiddleware, adminMiddleware, productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

// Set the port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
