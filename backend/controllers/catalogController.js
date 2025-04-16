const Product = require('../models/catalogModel'); // Import Product model
const Category = require('../models/Category'); // Import Category model

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

// Fetch products by categoryId (based on query parameter)
const getProductsByCategory = async (req, res) => {
  const { categoryId } = req.query; // Get categoryId from query params

  try {
    // Fetch products where the categoryId matches the one in the request query
    const products = await Product.find({ categoryId }).populate('categoryId');
    res.status(200).json(products); // Return the products as a response
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' }); // Handle errors
  }
};

module.exports = {
  getCategories,
  getProductsByCategory,
};
