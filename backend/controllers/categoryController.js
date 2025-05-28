const Category = require('../models/Category');

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching category items' });
  }
};

// Add new category
const addCategory = async (req, res) => {
  const { categoryName } = req.body;
  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  try {
    const existingCategory = await Category.findOne({ categoryName: categoryName.trim() });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category name already exists' });
    }

    const newCategory = new Category({ categoryName: categoryName.trim(), subcategories: [] });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Error adding category' });
  }
};

// Add subcategory
const addSubcategory = async (req, res) => {
  const { categoryId } = req.params;
  const { subcategoryName } = req.body;

  if (!subcategoryName) {
    return res.status(400).json({ error: 'Subcategory name is required' });
  }

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    if (category.subcategories.includes(subcategoryName.trim())) {
      return res.status(400).json({ error: 'Subcategory already exists' });
    }

    category.subcategories.push(subcategoryName.trim());
    await category.save();

    res.status(200).json({ message: 'Subcategory added successfully', category });
  } catch (error) {
    console.error('Error adding subcategory:', error);
    res.status(500).json({ error: 'Error adding subcategory' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting category' });
  }
};

// Update category name
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName } = req.body;

  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName: categoryName.trim() },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(updatedCategory);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Error updating category' });
  }
};

module.exports = {
  getAllCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  updateCategory,
};
