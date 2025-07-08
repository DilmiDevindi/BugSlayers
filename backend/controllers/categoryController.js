// controllers/categoryController.js

const Category = require('../models/Category');
const Subcategory = require('../models/Subcategory'); // ✅ Required for subcategory updates

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching category items' });
    }
};

// Add a new category
const addCategory = async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required' });
    }

    try {
        const newCategory = new Category({ categoryName });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error adding category:", error);
        res.status(500).json({ error: 'Error adding item' });
    }
};

// Delete a category by ID
const deleteCategory = async (req, res) => {
    const { id } = req.params;

    try {
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Optionally delete associated subcategories
        await Subcategory.deleteMany({ categoryId: id });

        res.json({ message: 'Category and associated subcategories deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category' });
    }
};


const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, subcategories } = req.body;

  console.log('Received update request for category:', id);
  console.log('Category name:', categoryName);
  console.log('Subcategories:', subcategories);

  if (!categoryName) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { categoryName },
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const existingSubs = await Subcategory.find({ categoryId: id });
    const existingSubIds = existingSubs.map(sub => sub._id.toString());

    const incomingSubIds = Array.isArray(subcategories)
      ? subcategories.filter(sub => sub._id).map(sub => sub._id)
      : [];

    console.log('Existing Subcategory IDs:', existingSubIds);
    console.log('Incoming Subcategory IDs:', incomingSubIds);

    const toDeleteIds = existingSubIds.filter(id => !incomingSubIds.includes(id));
    console.log('Subcategories to delete:', toDeleteIds);

    if (toDeleteIds.length > 0) {
      await Subcategory.deleteMany({ _id: { $in: toDeleteIds } });
      console.log(`Deleted ${toDeleteIds.length} subcategories`);
    }

    if (Array.isArray(subcategories)) {
      for (const sub of subcategories) {
        if (sub._id && sub.subcategoryName) {
          await Subcategory.findByIdAndUpdate(
            sub._id,
            { subcategoryName: sub.subcategoryName },
            { new: true, runValidators: true }
          );
          console.log(`Updated subcategory ${sub._id}`);
        }
      }

      const newSubs = subcategories.filter(sub => !sub._id && sub.subcategoryName);
      for (const sub of newSubs) {
        const newSub = new Subcategory({
          subcategoryName: sub.subcategoryName,
          categoryId: id,
        });
        await newSub.save();
        console.log('Added new subcategory:', sub.subcategoryName);
      }
    }

    res.json({ message: 'Category and subcategories updated successfully' });
  } catch (error) {
    console.error("Error updating category and subcategories:", error);
    res.status(500).json({ error: 'Error updating category and subcategories' });
  }
};


module.exports = {
    getAllCategories,
    addCategory,
    deleteCategory,
    updateCategory
};
