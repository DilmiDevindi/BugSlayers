// controllers/purchaseReportsController.js
const InventoryItem = require('../models/InventoryItem');

// GET /api/reports/purchases?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
const getOutSidePurchases = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Filter base
    const filter = { ProductStatus: 'Out-Side' };

    // If date range is provided, add it to the filter
    if (startDate && endDate) {
      filter.dateAdded = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Fetch purchases with populated category and subcategory
    const purchases = await InventoryItem.find(filter)
      .populate('category', 'categoryName')
      .populate('subcategory', 'subcategoryName')
      .sort({ dateAdded: -1 });

    res.status(200).json(purchases);
  } catch (error) {
    console.error('Error in purchase report controller:', error);
    res.status(500).json({ error: 'Failed to generate purchase report' });
  }
};

module.exports = {
  getOutSidePurchases
};
