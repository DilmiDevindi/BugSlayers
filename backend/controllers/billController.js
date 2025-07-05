const InventoryItem = require('../models/InventoryItem');

// @desc    Get item details by code for billing
// @route   GET /api/bill/item/:code
// @access  Public
const getItemByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const item = await InventoryItem.findOne({ code });

    if (!item) {
      return res.status(404).json({ message: 'Item not found for this code' });
    }

    // Send essential details only
    res.status(200).json({
      name: item.productName,
      price: item.sellingPrice,
      code: item.code,
      quantity: item.quantity,
      category: item.category,
    });
  } catch (error) {
    console.error('Error fetching item by code:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getItemByCode };




