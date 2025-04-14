const mongoose = require('mongoose');

// Define the schema for inventory items
const inventoryItemSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  quantity: { type: Number, required: true },
  buyingPrice: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  dateAdded: { type: Date, required: true }, 
  image: { type: String }                    
});

// Create and export the model
const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);

module.exports = InventoryItem;
