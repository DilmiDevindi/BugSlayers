// controllers/invoiceController.js

const Invoice = require('../models/invoice');

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = req.body.invoiceId || Date.now().toString(); // ✅ Use frontend-provided or fallback
    const invoiceData = { ...req.body, invoiceId };

    const newInvoice = new Invoice(invoiceData);
    await newInvoice.save();

    res.status(201).json(newInvoice);
  } catch (err) {
    console.error("Error saving invoice:", err.message);
    res.status(400).json({ error: err.message });
  }
};

// Fetch all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    console.error("Error fetching invoices:", err.message);
    res.status(500).json({ error: err.message });
  }
};
