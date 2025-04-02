// 2. routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

router.post('/add', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name.trim()) return res.status(400).json({ error: 'Category name cannot be empty' });
        const newCategory = new Category({ name });
        await newCategory.save();
        res.json({ message: 'Category added', category: newCategory });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route to delete a category by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
});

// Route to update a category by ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const updatedCategory = await Category.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});

module.exports = router;
