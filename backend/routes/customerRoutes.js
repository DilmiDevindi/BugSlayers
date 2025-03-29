const express = require('express');
const router = express.Router();
const Customer = require('../models/customerModel');

// @route   GET /api/customers
// @desc    Get all customers
// @access  Public
router.get('/api/customers', async (req, res) => {
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
app.post('/', async (req, res) => {
  try {
    const { name, address, contact, email } = req.body;

    // Check if customer exists
    const existingCustomer = await Customer.findOne({ name, address, contact, email });

    if (existingCustomer) {
      return res.status(200).json({ exists: true, success: false });
    }

    // Create new customer
    const newCustomer = new Customer({ name, address, contact, email });
    await newCustomer.save();

    res.status(201).json({ success: true, exists: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// @route   PUT /api/customers/:id
// @desc    Update a customer
// @access  Public
app.post('/api/customers', async (req, res) => {
  try {
    const { name, address, contact, email } = req.body;

    // Check if a customer with the same name, address, contact, and email already exists
    const existingCustomer = await Customer.findOne({ name, address, contact, email });

    if (existingCustomer) {
      return res.status(200).json({ exists: true, success: false });
    }

    // Create new customer if doesn't exist
    const newCustomer = new Customer({ name, address, contact, email });
    await newCustomer.save();

    res.status(201).json({ success: true, exists: false });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// @route   DELETE /api/customers/:id
// @desc    Delete a customer
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the customer by id and delete it
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
