const InventoryItem = require('../models/InventoryItem');

//get all inventory items
const getInventoryItems = async (req, res) => {
  try {
    const items = await InventoryItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
};

//add a new inventory item
const addInventoryItem = async (req, res) => {
  const { productName, category, quantity, buyingPrice, sellingPrice } = req.body;
  try {
    const newItem = new InventoryItem({ productName, category, quantity, buyingPrice, sellingPrice });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item:", error); // Log the error to the server
    res.status(500).json({ error: 'Error adding item' });
  }
};

//Get inventory count
const getInventoryCount = async (req, res) => {
  try {
    const count = await InventoryItem.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//update an inventory item
const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { productName, category, quantity, buyingPrice, sellingPrice} = req.body;
  try {
    const updatedItem = await InventoryItem.findByIdAndUpdate(
      id,
      { productName, category, quantity, buyingPrice, sellingPrice },
      { new: true, runValidators: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
};

//delete an inventory item
const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;
  try {
    await InventoryItem.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
};


// Export all functions
module.exports = {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem
};