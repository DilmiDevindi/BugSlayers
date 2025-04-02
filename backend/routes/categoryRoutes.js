// 2. routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.get('/', async (req, res) => {
    try {
        const category = await Category.find();
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category items'});
    }
});

//Route to add a new category item
router.post('/add', async (req, res) => {
        const { categoryName } = req.body;
        try {
          const newCategory = new Category({ categoryName });
          await newCategory.save();
          res.status(201).json(newCategory);
        } catch (error) {
          console.error("Error adding category:", error);
          res.status(500).json({ error: 'Error adding item' });
        }
});

// Route to delete a category by ID
router.delete('/:id', async (req, res) => {
        const { id } = req.params;
        try {
            await Category.findByIdAndDelete(id);
            res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category'});
    }
});

// Route to update a category by ID
router.put('/api/category/:id', async (req, res) => {
        const { id } = req.params;
        const { categoryName } = req.body;
        try {
        const updatedCategory = await Category.findByIdAndUpdate(id, 
            { categoryName }, 
            { new: true, runValidators: true }
        );
        res.json(updatedCategory); 
    } catch (error) {
        res.status(500).json({ error: 'Error updating category' });
    }
});

module.exports = router;
