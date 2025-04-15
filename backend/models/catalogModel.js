// models/catalogModel.js

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemCode: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // image path or URL
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
