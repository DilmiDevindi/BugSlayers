const Order = require('../models/orderModel');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ date: -1 });
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: `Error fetching orders: ${error.message}` });
  }
};

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { orderId, quantity, discount, date } = req.body;

    if (!orderId || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const order = new Order({ orderId, quantity, discount, date });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(400).json({ error: `Error creating order: ${error.message}` });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { orderId, quantity, discount, date } = req.body;

    if (!orderId || !quantity || !discount || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Updating order ID:', req.params.id, req.body); // Debug log
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderId,
        quantity: Number(quantity),
        discount: Number(discount),
        date: new Date(date),
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: `Failed to update order: ${error.message}` });
  }
};