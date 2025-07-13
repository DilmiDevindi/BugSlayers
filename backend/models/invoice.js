const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  itemCode: String,
  itemName: String,
  itemPrice: String,
  buyingPrice: String,
  quantity: Number,
  discount: Number,
  profit: String,
});

const InvoiceSchema = new mongoose.Schema({
  invoiceId: String, 
  date: String,
  time: String,
  contact: String,
  name: String,
  address: String,
  email: String,
  items: [ItemSchema],
  subtotal: String,
  amount: String,
  cashReceived: String,
  balance: String,
  profit: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
