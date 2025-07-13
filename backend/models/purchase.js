// ✅ backend/models/Purchase.js

const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  supplier: {
    type: String,
    required: true,
    trim: true
  },
  product: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: String,
    default: "0%"
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  }
}, {
  timestamps: true
});

const Purchase = mongoose.models.Purchase || mongoose.model("Purchase", purchaseSchema);
module.exports = Purchase;