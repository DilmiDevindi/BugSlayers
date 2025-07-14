const Return = require('../models/returnModel');
const Category = require('../models/categoryModel');
const Subcategory = require('../models/subcategoryModel');

// Generate unique Return ID like RET-001, RET-002, etc.
async function generateReturnId() {
  const count = await Return.countDocuments();
  const num = String(count + 1).padStart(3, '0');
  return `RET-${num}`;
}

// Add new Return
exports.addReturn = async (req, res) => {
  try {
    const return_id = await generateReturnId();

    // Validate category exists
    const categoryExists = await Category.findById(req.body.category);
    if (!categoryExists) {
      return res.status(400).json({ message: `Category not found` });
    }

    // Validate subcategory belongs to category
    const subcategoryExists = await Subcategory.findOne({
      _id: req.body.subcategory,
      category: req.body.category,
    });
    if (!subcategoryExists) {
      return res.status(400).json({
        message: `Subcategory does not belong to the selected category`,
      });
    }

    // Create new return document with correct return_id field
    const newReturn = new Return({ ...req.body, return_id });
    await newReturn.save();

    res.status(201).json(newReturn);
  } catch (err) {
    console.error('AddReturn Error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Return ID already exists', error: err.message });
    }
    res.status(500).json({ error: err.message });
  }
};

// Get all returns, populate supplier, category, subcategory
exports.getReturns = async (req, res) => {
  try {
    const list = await Return.find()
      .populate('supplier', 'supplierName')
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName')
      .sort({ createdAt: -1 });

    res.json(list);
  } catch (err) {
    console.error('GetReturns Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Update a return by ID
exports.updateReturn = async (req, res) => {
  try {
    // Validate category and subcategory if provided
    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        return res.status(400).json({ message: `Category not found` });
      }
    }

    if (req.body.subcategory && req.body.category) {
      const subcategoryExists = await Subcategory.findOne({
        _id: req.body.subcategory,
        category: req.body.category,
      });
      if (!subcategoryExists) {
        return res.status(400).json({
          message: `Subcategory does not belong to the selected category`,
        });
      }
    }

    const updated = await Return.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Return not found' });
    }

    res.json(updated);
  } catch (err) {
    console.error('UpdateReturn Error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a return by ID
exports.deleteReturn = async (req, res) => {
  try {
    const deleted = await Return.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Return not found' });
    }
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('DeleteReturn Error:', err);
    res.status(500).json({ error: err.message });
  }
<<<<<<< Updated upstream
};

// Get the last return_id to help generate next ID
exports.getLastReturnId = async (req, res) => {
  try {
    const lastReturn = await Return.findOne().sort({ createdAt: -1 }).select('return_id');
    res.json({ last_id: lastReturn ? lastReturn.return_id : null });
  } catch (err) {
    console.error('GetLastReturnId Error:', err);
    res.status(500).json({ error: err.message });
  }
};
=======
};
>>>>>>> Stashed changes
