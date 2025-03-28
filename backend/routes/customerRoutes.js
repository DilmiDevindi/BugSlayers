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

    // Create a new customer
    const newCustomer = new Customer({
      name,
      address,
      contact,
      email,
    });

    // Save the customer to the database
    await newCustomer.save();

    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/customers/:id
// @desc    Update a customer
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact, email } = req.body;

    // Find the customer by id and update it
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      { name, address, contact, email },
      { new: true } // Returns the updated document
    );

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Server Error' });
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
