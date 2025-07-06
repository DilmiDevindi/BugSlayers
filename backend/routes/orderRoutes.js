const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Add new order with orderId, quantity, discount, date
router.post('/', async (req, res) => {
  const { orderId, quantity, discount, date } = req.body;

  const newOrder = new Order({
    orderId,
    quantity,
    discount,
    date,
  });

  try {
    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('Error saving order:', err);
    res.status(400).json({ message: 'Failed to save order' });
  }
});

module.exports = router;
