// controllers/catalogController.js

const Product = require('../models/catalogModel');

// Fetch all products
const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find(); // Retrieve all products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Server Error' });
    }
  };

 
module.exports = {
    getAllProducts
  };