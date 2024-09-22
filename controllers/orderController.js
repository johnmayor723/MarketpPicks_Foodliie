const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const order = new Order({
      user: req.user._id,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice: cart.totalPrice,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ status: order.orderStatus });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.orderStatus = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};