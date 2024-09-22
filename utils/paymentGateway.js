const stripe = require('stripe')(process.env.STRIPE_SECRET);

const createPaymentIntent = async (amount) => {
  return await stripe.paymentIntents.create({
    amount: amount * 100, // amount in cents
    currency: 'usd',
  });
};

module.exports = { createPaymentIntent };