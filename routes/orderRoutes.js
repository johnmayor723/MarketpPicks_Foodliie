const express = require('express');
const { getOrderStatus, updateOrderStatus } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:orderId/status', authMiddleware, getOrderStatus);
router.patch('/:orderId/status', authMiddleware, updateOrderStatus);  // Admin or automated system can call this

module.exports = router;