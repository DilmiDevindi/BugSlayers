const InventoryItem = require('../models/InventoryItem');
const Category = require('../models/Category');
const path = require('path');

// Utility function to generate prefix based on category name
const getCategoryPrefix = (categoryName) => {
  return categoryName
    .split(' ')
    .map(word => word[0].toLowerCase())
    .join('');
};

// Get all inventory items
const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find().populate('category'); // Populate to get category name
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
};

// Add a new inventory item
const addInventoryItem = async (req, res) => {
  const { productName, category, quantity, buyingPrice, sellingPrice, dateAdded } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    if (!category) return res.status(400).json({ error: 'Category is required.' });

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) return res.status(404).json({ error: 'Category not found' });

    const categoryName = categoryDoc.categoryName;
    const prefix = getCategoryPrefix(categoryName);

    const existingCount = await InventoryItem.countDocuments({ category });
    const nextNumber = existingCount + 1;
    const code = `${prefix}${String(nextNumber).padStart(3, '0')}`;

    if (isNaN(quantity) || quantity <= 0) return res.status(400).json({ error: 'Invalid quantity.' });
    if (isNaN(buyingPrice) || buyingPrice < 0) return res.status(400).json({ error: 'Invalid buying price.' });
    if (isNaN(sellingPrice) || sellingPrice < 0) return res.status(400).json({ error: 'Invalid selling price.' });

    const newItem = new InventoryItem({
      productName,
      category,
      quantity,
      buyingPrice,
      sellingPrice,
      dateAdded,
      image,
      code
    });

    await newItem.save();

    // Populate category before sending back
    const populatedItem = await InventoryItem.findById(newItem._id).populate('category');

    console.log("New Item with code:", populatedItem.code);
    res.status(201).json(populatedItem);

  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ error: 'Error adding item' });
  }
};


// Get inventory count
const getInventoryCount = async (req, res) => {
  try {
    const count = await InventoryItem.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an inventory item
const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { productName, category, quantity, buyingPrice, sellingPrice, dateAdded } = req.body;

  const updateData = {
    productName,
    category,
    quantity,
    buyingPrice,
    sellingPrice,
    dateAdded
  };

  if (req.file) {
    updateData.image = req.file.filename;
  }

  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });
    res.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: 'Error updating item' });
  }
};

// Delete an inventory item
const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
};

module.exports = {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem
};
