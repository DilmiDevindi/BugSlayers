const express = require('express');
const Sales = require('../models/sales');
const router = express.Router();

router.post('/add', async (req, res) => {
    console.log('Incoming sale data:', req.body); // 👀 log this
  
    try {
      const newSale = new Sales(req.body);
      await newSale.save();
      res.status(201).json(newSale);
    } catch (error) {
      console.error('Error saving sale:', error);
      res.status(500).json({ message: 'Error adding sale', error });
    }
  });
  
module.exports = router;
