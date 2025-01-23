const User = require('../models/User');
const Coupon = require('../models/Coupon');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
  const { userId, couponName, couponId } = req.body;

  try {
    // Fetch the user and coupon from the database
    const user = await User.findById(userId);
    const coupon = await Coupon.findOne({ couponId });

    if (!user || !coupon) {
      return res.status(404).json({ message: 'User or Coupon not found' });
    }

    // Check if the coupon is valid
    if (!coupon.isValid) {
      return res.status(400).json({ message: 'Coupon is no longer valid' });
    }

    // Check if the user has already activated a coupon with the same promoIdentifier
    const isAlreadyActivated = user.coupons.some(
      (c) => c.promoIdentifier === coupon.promoIdentifier
    );

    if (isAlreadyActivated) {
      return res.status(400).json({
        message: 'A coupon from this promotion is already activated on your account',
      });
    }

    // Add the coupon to the user's account
    user.coupons.push({
      couponName: coupon.name
      couponId: coupon.couponId,
      promoIdentifier: coupon.promoIdentifier,
      activatedAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      message: 'Coupon activated successfully',
      coupon: {
        couponId: coupon.couponId,
        promoIdentifier: coupon.promoIdentifier,
      },
    });
  } catch (error) {
    console.error(error);
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
