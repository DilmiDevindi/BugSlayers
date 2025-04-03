const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  date: Date,
  supplierName: String,
  phone1: String,
  phone2: String,
  fax:String,
  email: String,
  address: String,
  supplyProducts: String,
  paymentTerms: String
  
});

// Assuming you're using Express for the backend
const express = require('express');
const router = express.Router();

router.post('/suppliers', (req, res) => {
  const { date, ...otherFields } = req.body;

  // Validate date (ensure it's not in the future)
  if (new Date(date) > new Date()) {
    return res.status(400).json({ error: 'Date cannot be in the future.' });
  }

  // Continue with the rest of the logic to save the supplier
  // ...
});

module.exports = router;


module.exports = mongoose.model('Supplier', SupplierSchema);

