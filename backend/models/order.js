const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, required: true },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);
