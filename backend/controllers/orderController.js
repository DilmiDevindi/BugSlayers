const Order = require('../models/orderModel');

// ✅ Fetch orders within a date range
exports.getOrdersByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const orders = await Order.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching order report:', err);
    res.status(500).json({ message: 'Failed to fetch order report' });
  }
};
