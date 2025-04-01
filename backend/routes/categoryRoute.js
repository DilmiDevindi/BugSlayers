// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/category');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to add a new category
router.post('/add', async (req, res) => {
    const { CategoryName } = req.body;
    try {
      const newCategory = new Category({ CategoryName });
      await newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      console.error("Error adding category:", error);
      res.status(500).json({ error: 'Error adding category' });
    }
  });
  
  // Route to update a category
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { CategoryName } = req.body;
    try {
      const updatedCategory = await Category.findByIdAndUpdate(
        id,
        { CategoryName },
        { new: true, runValidators: true }
      );
      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: 'Error updating category' });
    }
  });
  
  // Route to delete a category
  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await Category.findByIdAndDelete(id);
      res.json({ message: 'Category deleted successfully!' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting category' });
    }
  });
  
  module.exports = router;
  
