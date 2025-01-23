const express = require('express');
const { register, login, validateCoupon, updateCouponValue } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
// Validate Active Coupon
router.post('/validate-coupon', validateCoupon);

// Update Coupon Value
router.post('/update-coupon', updateCouponValue);


module.exports = router;
