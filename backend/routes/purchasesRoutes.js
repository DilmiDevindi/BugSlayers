const express = require('express');
const router = express.Router();

const {
  getPurchases,
  getPurchaseCount,
  getPurchaseById,
  createPurchase,
  updatePurchase,
  deletePurchase,
} = require('../controllers/purchaseController');

// Define backend routes  
router.get('/', getPurchases); // Fetch all purchase records
router.get('/count', getPurchaseCount); // Get purchase record count
router.get('/:id', getPurchaseById); // Get a single purchase by ID
router.post('/add', createPurchase); // Create a new purchase record
router.put('/:id', updatePurchase); // Update a purchase record by ID
router.delete('/:id', deletePurchase); // Delete a purchase record by ID

module.exports = router;
