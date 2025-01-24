const couponSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  couponId: { type: String, required: true, unique: true },
  couponCode: { type: String, required: true },
  value: { type: Number, required: true },
  isValid: { type: Boolean, default: true },
  activatedAt: { type: Date, required: true },
});

module.exports = mongoose.model('Coupon', couponSchema);
