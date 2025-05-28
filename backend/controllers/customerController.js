const Customer = require('../models/customerModel'); // Ensure this model exists


// GET /api/customers/contact/:contact
const getCustomerByContact = async (req, res) => {
  try {
    const contact = req.params.contact;
    
    const customer = await Customer.findOne({ contact }); // Adjust based on your DB

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json({
      name: customer.name,
      address: customer.address,
      email: customer.email
    });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Other controller functions (getCustomers, createCustomer, etc.) remain unchanged


// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const existingCustomer = await Customer.findOne({ name: name.trim() });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this name already exists' });
    }

    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error creating customer', error });
    }
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedCustomer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
};

// Get customer by name
const getCustomerByName = async (req, res) => {
  try {
    const { name } = req.params;
    const customer = await Customer.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer by name', error });
  }
};



module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByName,
  getCustomerByContact // ✅ Don't forget this!
};
