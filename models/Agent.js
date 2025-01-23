const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  couponIdentifier: { type: String, required: true },
  totalSales: { type: Number, default: 0 },
});

module.exports = mongoose.model('Agent', AgentSchema);
