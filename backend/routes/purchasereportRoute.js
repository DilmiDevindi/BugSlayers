const express = require('express');
const router = express.Router();
const Purchase = require('../models/purchase');  // Make sure you have the 'purchase' model

// Generate purchase report based on date range
router.get('/purchase-report', async (req, res) => {
  console.log('📥 Purchase report route hit:', req.query);
  const { startDate, endDate } = req.query;

  try {
    const report = await Purchase.aggregate([
      { 
        $match: { 
          date: { $gte: new Date(startDate), $lte: new Date(endDate) } 
        } 
      },
      { 
        $group: { 
          _id: '$productName', 
          totalPurchase: { $sum: '$price' }, 
          totalQuantity: { $sum: '$quantity' } 
        }
      }
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error('❌ Error generating report:', error);
    res.status(500).json({ message: 'Error generating purchase report', error });
  }
});

module.exports = router;
