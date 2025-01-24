const User = require('../models/User');
const Coupon = require('../models/Coupon');
const CouponCode = require('../models/CouponCode')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
};


// Activate Coupon for a User
exports.activateCoupon = async (req, res) => {
  try {
    // Fetch the authenticated user's ID from the session
    const userId = req.session.currentuser;

    // Validate if the user ID exists in the session
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { couponCode } = req.body;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user already has a valid coupon
    const existingValidCoupon = await Coupon.findOne({ userId, isValid: true });
    if (existingValidCoupon) {
      return res
        .status(400)
        .json({ message: 'You already have an active coupon' });
    }

    // Fetch the coupon code from the CouponCode model
    const validCouponCode = await CouponCode.findOne({ couponCode });
    if (!validCouponCode || !validCouponCode.isValid) {
      return res
        .status(400)
        .json({ message: 'Invalid or expired coupon code' });
    }

    // Generate a unique ID for the activated coupon
    const couponId = uuidv4();

    // Save the activated coupon in the Coupon model
    const activatedCoupon = new Coupon({
      userId: user._id,
      couponId,
      couponCode: validCouponCode.couponCode,
      value: 50000, // Coupon value in Naira
      isValid: true, // Mark the coupon as valid
      activatedAt: new Date(),
    });

    await activatedCoupon.save();

    // Mark the coupon code as used in the CouponCode model
    //validCouponCode.isValid = false;
    await validCouponCode.save();

    res.status(200).json({
      message: 'Coupon activated successfully',
      coupon: {
        couponId,
        couponCode: validCouponCode.couponCode,
        value: 50000,
      },
    });
  } catch (error) {
    console.error('Error activating coupon:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Validate Active Coupon
exports.validateCoupon = async (req, res) => {
  const { userId, couponCode } = req.body;

  try {
    // Fetch user and coupon details
    const user = await User.findById(userId);
    const coupon = await Coupon.findOne({ promoIdentifier: couponCode });

    if (!user || !coupon) {
      return res.status(404).json({ message: 'User or Coupon not found' });
    }

    // Check if the coupon is valid and not used by the user
    const isUsed = user.coupons.some(c => c.promoIdentifier === couponCode);
    if (!coupon.isValid || isUsed) {
      return res.status(400).json({
        message: isUsed
          ? 'Coupon already used'
          : 'Coupon is no longer valid',
      });
    }

    // Update Coupon Value
exports.updateCouponValue = async (req, res) => {
  const { userId, couponCode, usedValue } = req.body;

  try {
    // Fetch user and coupon details
    const user = await User.findById(userId);
    const coupon = await Coupon.findOne({ promoIdentifier: couponCode });

    if (!user || !coupon) {
      return res.status(404).json({ message: 'User or Coupon not found' });
    }

    // Ensure the coupon hasn't been used already by the user
    const isUsed = user.coupons.some(c => c.promoIdentifier === couponCode);
    if (isUsed) {
      return res.status(400).json({ message: 'Coupon already used' });
    }

    // Deduct the used value from the coupon
    coupon.value -= usedValue;

    // Mark coupon as invalid if exhausted
    if (coupon.value <= 0) {
      coupon.isValid = false;
    }

    // Associate the coupon with the user
    user.coupons.push({ promoIdentifier: couponCode });

    await coupon.save();
    await user.save();

    res.status(200).json({
      message: 'Coupon value updated successfully',
      remainingValue: coupon.value,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


    res.status(200).json({
      message: 'Coupon is valid',
      remainingValue: coupon.value,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
