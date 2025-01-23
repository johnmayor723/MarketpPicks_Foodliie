const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Create a Coupon
router.post('/create', couponController.createCoupon);

module.exports = router;
