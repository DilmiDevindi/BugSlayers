// models/catalogModel.js

const mongoose = require('mongoose');

// Define schema for a product
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemCode: { type: String, required: true, unique: true },
  categoryName: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String }, // Can store URL or Base64 image data
}, { timestamps: true });

// Create and export the model
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
