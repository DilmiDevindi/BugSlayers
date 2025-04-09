const express = require('express');
const router = express.Router();

const {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');

// Define backend routes
router.get('/', getInventoryItems); // Fetch all inventory items
router.post('/add', addInventoryItem); // Add a new inventory item 
router.get('/count', getInventoryCount); // Get inventory count
router.put('/:id', updateInventoryItem); // Update an inventory item
router.delete('/:id', deleteInventoryItem); // Delete an inventory item


module.exports = router;
