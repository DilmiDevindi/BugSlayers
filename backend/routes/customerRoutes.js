const express = require('express');
const router = express.Router();

const {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomerByContact, // ✅ Import this
} = require('../controllers/customerController');

// Routes
router.get('/', getCustomers);                         // All customers
router.post('/', createCustomer);                      // Add customer
router.put('/:id', updateCustomer);                    // Update customer
router.delete('/:id', deleteCustomer);                 // Delete customer
          // Get by name
router.get('/contact/:contact', getCustomerByContact); // ✅ Get by contact

module.exports = router;
