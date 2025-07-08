// controllers/invoiceController.js

const Invoice = require('../models/invoice');

// Helper to generate numeric invoice ID
const generateInvoiceId = async () => {
  const now = Date.now();
  return now.toString(); // Returns something like '1720375000000'
};

// Create a new invoice
exports.createInvoice = async (req, res) => {
  try {
    const invoiceId = await generateInvoiceId();
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
