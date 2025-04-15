const Category = require('../models/Category');
const Product = require('../models/catalogModel');

// Fetch all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find(); // Retrieve all categories
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Fetch products by category
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.query; // Read categoryId from query parameters
  try {
    const products = await Product.find({ categoryId }); // Retrieve products matching categoryId
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

 
module.exports = {
    getAllProducts
  };