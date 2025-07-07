// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const Invoice = require('../models/invoice'); // ✅ Import the model

// Create invoice
router.post('/', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    console.error("Error saving invoice:", err.message);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Fetch all invoices (required for the table)
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ date: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

