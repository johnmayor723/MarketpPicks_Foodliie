const express = require('express');
const { register, login, activateCoupon, validateCoupon, updateCouponValue } = require('../controllers/authController');
const router = express.Router();

// user's authentication routes

router.post('/register', register);
router.post('/login', login);

//user's coupon routes

// Validate Active Coupon
router.post('/activate-coupon', activateCoupon);

// Validate Active Coupon
router.post('/validate-coupon', validateCoupon);

// Update Coupon Value
router.post('/update-coupon', updateCouponValue);


module.exports = router;
