// controllers/orderController.js
const Order = require('../models/orderModel');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching orders' });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, quantity, discount, date } = req.body;

    if (!orderId || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newOrder = new Order({ orderId, quantity, discount, date });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add order' });
  }
};
