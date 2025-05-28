const Category = require('../models/Category');

const addOrUpdateCategory = async (req, res) => {
  const { categoryId, categoryName, subCategoryName } = req.body;

  try {
    if (categoryId) {
      // Add subcategory to existing category
      const category = await Category.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (category.subcategories.includes(subCategoryName)) {
        return res.status(400).json({ error: 'Subcategory already exists' });
      }

      category.subcategories.push(subCategoryName);
      await category.save();

      return res.status(200).json({ message: 'Subcategory added successfully', category });
    }

    // Add new category with subcategory
    if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category exists already (optional)
    const existingCategory = await Category.findOne({ categoryName: categoryName.trim() });
    if (existingCategory) {
      return res.status(400).json({ error: 'Category already exists' });
    }

    const newCategory = new Category({
      categoryName: categoryName.trim(),
      subcategories: subCategoryName ? [subCategoryName] : [],
    });
    await newCategory.save();

    return res.status(201).json({ message: 'Category created successfully', category: newCategory });
  } catch (error) {
    console.error('Error in addOrUpdateCategory:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  // existing exports
  addOrUpdateCategory,
};
