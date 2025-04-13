const express = require('express');
const Sales = require('../models/sales');
const router = express.Router();

// Add a new sales record
router.post('/add', async (req, res) => {
  try {
    const newSale = new Sales(req.body);
    await newSale.save();
    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ message: 'Error adding sale', error });
  }
});



module.exports = router;
