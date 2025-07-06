const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
