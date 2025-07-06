const Order = require('../models/orderModel');

  // Get all orders (sorted by date desc)
  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().sort({ date: -1 });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching orders' });
    }
  };

  // Create a new order
  exports.createOrder = async (req, res) => {
    try {
      const { orderId, quantity, discount, date } = req.body;
      const order = new Order({ orderId, quantity, discount, date });
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: 'Error creating order' });
    }
  };

  // Update an existing order
  exports.updateOrder = async (req, res) => {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id,
        {
          orderId: req.body.orderId,
          quantity: req.body.quantity,
          discount: req.body.discount,
          date: req.body.date,
        },
        { new: true, runValidators: true }
      );

      if (!updatedOrder) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update order' });
    }
  };

  // Get order report filtered by date range
  exports.getOrderReport = async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      // Validate dates
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate query parameters are required' });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // Adjust end date to end of the day
      end.setHours(23, 59, 59, 999);

      // Find orders between start and end dates (inclusive)
      const orders = await Order.find({
        date: { $gte: start, $lte: end }
      }).sort({ date: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: 'Error generating order report' });
    }
  };