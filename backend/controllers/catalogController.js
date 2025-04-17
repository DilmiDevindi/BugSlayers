const InventoryItem = require('../models/InventoryItem');
const Category = require('../models/Category');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const products = await InventoryItem.find({ category: categoryId });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};


module.exports = {
  getCategories,
  getProductsByCategory
};
