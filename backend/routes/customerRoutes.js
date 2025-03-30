const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

// @route   GET /api/customers
// @desc    Get all customers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/customers/count
// @desc    Get customer count
// @access  Public
router.get('/count', async (req, res) => {
  try {
    const count = await Customer.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/customers
// @desc    Add a new customer
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, address, contact, email } = req.body;

    // Check if the customer already exists by name
    const existingCustomer = await Customer.findOne({ name });

    if (existingCustomer) {
      return res.status(200).json({ exists: true, success: false });
    }

    // Create a new customer if the name is not taken
    const newCustomer = new Customer({ name, address, contact, email });
    await newCustomer.save();

    res.status(201).json({ success: true, exists: false });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

// @route   GET /api/customers/check-name
// @desc    Check if a customer name exists
// @access  Public
router.get('/check-name', async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Check if the customer exists by name
    const customer = await Customer.findOne({ name });

    res.json({ exists: !!customer });
  } catch (error) {
    console.error('Error checking customer name:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the customer by id
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
