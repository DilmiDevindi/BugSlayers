const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  supplierName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  quantity: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  amountPaid: { type: Number, required: true },
  status: { type: String, enum: ['Paid', 'Not Paid'], default: 'Not Paid' },
  date: { type: String, required: true },
});

module.exports = mongoose.model('Order', orderSchema);