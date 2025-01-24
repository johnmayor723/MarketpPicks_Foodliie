const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  couponId: { type: String, required: true, unique: true },
  couponCode: { type: String, required: true }, // Unique identifier
  value: { type: Number, default: 50000,  required: true }, // Remaining coupon value
  isValid: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true }, // Last day of the month
});

module.exports = mongoose.model('Coupon', CouponSchema);
