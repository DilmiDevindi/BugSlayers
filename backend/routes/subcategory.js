const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');

// Create a new subcategory
router.post('/', async (req, res) => {
  try {
    const { subcategoryName, categoryId } = req.body;

    const newSubcategory = new Subcategory({
      subcategoryName,
      categoryId
    });

    await newSubcategory.save();
    res.status(201).json({ message: 'Subcategory created successfully', subcategory: newSubcategory });
  } catch (error) {
    res.status(500).json({ error: 'Error creating subcategory', details: error.message });
  }
});

// Get all subcategories
router.get('/', async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate('categoryId', 'categoryName');
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subcategories', details: error.message });
  }
});

// Get subcategories by category ID
router.get('/by-category/:categoryId', async (req, res) => {
  try {
    const subcategories = await Subcategory.find({ categoryId: req.params.categoryId });
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching subcategories by category', details: error.message });
  }
});

module.exports = router;