const Customer = require('../models/customerModel'); // Ensure this model exists

// Fetch all customers
// Fetch customers (with optional filtering by name)
// Fetch customers (with optional filtering by name)
const getCustomers = async (req, res) => {
  try {
    const { name, date } = req.query;
    let query = {};

    if (name) {
      query.name = name; // Search by name if provided
    }

    if (date) {
      query.date = new Date(date); // Search by date if provided
    }

    const customers = await Customer.find(query);
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
};


// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { date, name, address, contact, email } = req.body;

    // Validate request body
    if (!name || !email || !date || !address || !contact) {
      return res.status(400).json({ message: 'Name, email, date, address, and contact are required' });
    }

    // Validate email format
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format. Please use a valid @gmail.com email.' });
    }

    // Validate contact number (example: 10-digit number)
    if (!/^[0-9]{10}$/.test(contact)) {
      return res.status(400).json({ message: 'Invalid contact number. It should be a 10-digit number.' });
    }

    // Check if customer with the same email exists
    const existingCustomer = await Customer.findOne({ email: email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists' });
    }
    // Create a new customer with the provided date and other data
    const newCustomer = new Customer({ date: new Date(date), name, address, contact, email });

    const savedCustomer = await newCustomer.save();
    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error('Error creating customer:', error); // Log the error for debugging
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: 'Validation error', error: error.message });
    } else {
      res.status(500).json({ message: 'Error creating customer', error });
    }
  }
};

  

// Update an existing customer
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




module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  
};

