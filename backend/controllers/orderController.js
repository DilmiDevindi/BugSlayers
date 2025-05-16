const Order = require('../models/Order');

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

// Create a new order
const createOrder = async (req, res) => {
  const { orderId, quantity, discount, date } = req.body;
  try {
    const newOrder = new Order({ orderId, quantity, discount, date });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error creating order', error });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error });
  }
};

// Update order
const updateOrder = async (req, res) => {
  const { orderId, quantity, discount, date } = req.body;
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { orderId, quantity, discount, date },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: 'Error updating order', error });
  }
};

// Delete order
const deleteOrder = async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error });
  }
};

module.exports = {
  getAllOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
};