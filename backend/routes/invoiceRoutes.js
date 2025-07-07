const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    console.log("Received invoice:", req.body);  // <-- Debug log

    const invoice = new Invoice(req.body);
    await invoice.save();

    res.status(201).json(invoice);
  } catch (err) {
    console.error("Error saving invoice:", err.message);  // <-- Show the real reason
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
