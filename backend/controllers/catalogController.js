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



 
module.exports = {
    getAllProducts
  };