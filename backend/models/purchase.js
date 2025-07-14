const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,  // ensure unique product codes
  },
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  buyingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  dateAdded: {
    type: Date,
    required: true,
  },
  image: {
    type: String,  // will store filename or path
    default: null,
  },
  ProductStatus: {
    type: String,
    default: 'Available',
    trim: true,
  },
  availableForOffer: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no',
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true,
  },
}, {
  timestamps: true,  // automatically add createdAt, updatedAt fields
});

const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
module.exports = InventoryItem;
