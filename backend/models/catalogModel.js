const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  itemCode: { type: String, required: true, unique: true },
  categoryId: { // Updated to refer to category by ID instead of name
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', // Establish reference to Category model
    required: true,
  },
  price: { type: Number, required: true },
  image: { type: String }, // image path or URL
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
