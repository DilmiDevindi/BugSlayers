const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const { orderId, quantity, discount, date } = req.body;

    const newOrder = new Order({ orderId, quantity, discount, date });
    await newOrder.save();
    
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};
