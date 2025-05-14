const express = require('express');
const Sales = require('../models/sales');
const router = express.Router();

router.get('/api/daily-reports/daily-sales-report', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ message: 'Date is required' });
  }

  const selectedDate = new Date(date);
  const nextDate = new Date(date);
  nextDate.setDate(selectedDate.getDate() + 1);

  try {
    const report = await Sales.aggregate([
      {
        $match: {
          date: {
            $gte: selectedDate,
            $lt: nextDate
          }
        }
      },
      {
        $group: {
          _id: '$productName',
          totalSales: { $sum: '$price' },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      {
        $project: {
          productName: '$_id',
          totalSales: 1,
          totalQuantity: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json(report);
  } catch (error) {
    console.error('❌ Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error });
  }
});

module.exports = router;
