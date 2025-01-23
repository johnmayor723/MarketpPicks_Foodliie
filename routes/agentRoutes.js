const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');

// Create Agent
router.post('/create', async (req, res) => {
  const { name, email, couponIdentifier } = req.body;

  try {
    const agentExists = await Agent.findOne({ email });
    if (agentExists) {
      return res.status(400).json({ message: 'Agent already exists' });
    }

    const agent = new Agent({
      name,
      email,
      couponIdentifier,
      totalSales: 0, // Default value
    });

    await agent.save();
    res.status(201).json({ message: 'Agent created successfully', agent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Agent's Total Sales
router.patch('/update-sales', async (req, res) => {
  const { couponIdentifier, transactionAmount } = req.body;

  try {
    const agent = await Agent.findOne({ couponIdentifier });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    agent.totalSales += transactionAmount;
    await agent.save();

    res.status(200).json({ message: 'Agent sales updated', totalSales: agent.totalSales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
