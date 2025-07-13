const Purchase = require('../models/purchase');

exports.getPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName')
      .sort({ date: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      sellingPrice,
      discount,
      total,
      date,
    } = req.body;

    if (!supplier || !product || !category || !subcategory || !quantity || !price || !sellingPrice || !date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPurchase = new Purchase({
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      sellingPrice,
      discount,
      total,
      date,
    });

    await newPurchase.save();
    await newPurchase.populate('category', 'categoryName');
    await newPurchase.populate('subcategory', 'subcategoryName');
    res.status(201).json(newPurchase);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create purchase', details: err.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      sellingPrice,
      discount,
      total,
      date,
    } = req.body;

    const updated = await Purchase.findByIdAndUpdate(
      req.params.id,
      {
        supplier,
        product,
        category,
        subcategory,
        quantity,
        price,
        sellingPrice,
        discount,
        total,
        date,
      },
      { new: true, runValidators: true }
    )
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName');

    if (!updated) return res.status(404).json({ error: 'Purchase not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed', details: err.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Purchase not found' });
    res.json({ message: 'Purchase deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed', details: err.message });
  }
};

