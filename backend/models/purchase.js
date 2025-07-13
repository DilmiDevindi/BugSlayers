const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  supplier: { type: String, required: true },
  product: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  discount: { type: String, default: '0%' },
  total: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('Purchase', purchaseSchema);