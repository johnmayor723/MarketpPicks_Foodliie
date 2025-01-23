const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  name: { type: String, required: true },
  couponId: { type: String, required: true, unique: true }, // Unique identifier
  promoIdentifier: { type: String, required: true },
  agentIdentifier: { type: String, required: true },
  value: { type: Number, required: true }, // Remaining coupon value
  isValid: { type: Boolean, default: true },
  expiryDate: { type: Date, required: true }, // Last day of the month
});

module.exports = mongoose.model('Coupon', CouponSchema);
