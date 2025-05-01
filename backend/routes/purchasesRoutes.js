const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');

// Add a purchase record
router.post('/add', async (req, res) => {
  try {
    const newPurchase = new Purchase(req.body);
    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(500).json({ message: 'Error adding purchase', error });
  }
});

// Get all purchase records
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.status(200).json(purchases);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching purchases', error });
  }
});

// Update a purchase record
router.put('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({ message: 'Error updating purchase', error });
  }
});

// Delete a purchase record
router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findByIdAndDelete(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.status(200).json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting purchase', error });
  }
});

module.exports = router;
