const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  date: String,
  contact: String,
  name: String,
  address: String,
  email: String,
  itemName: String,
  itemCode: String,
  itemPrice: String,
  quantity: Number,
  price: String,
  discount: String,
  amount: String,
  cashReceived: String,
  balance: String
});

module.exports = mongoose.model('Invoice', invoiceSchema);
