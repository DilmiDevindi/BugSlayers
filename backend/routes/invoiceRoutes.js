const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice'); // Mongoose model

// POST /api/invoices
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
