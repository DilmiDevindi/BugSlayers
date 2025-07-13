const Purchase = require("../models/purchase");

// Get purchases by date range (or all if no dates provided)
exports.getPurchases = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let filter = {};
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.date = { $gte: start, $lte: end };
    }

    const purchases = await Purchase.find(filter).sort({ date: 1 });

    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Failed to fetch purchases" });
  }
};

exports.createPurchase = async (req, res) => {
  try {
    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      discount,
      total,
      date,
    } = req.body;

    if (!supplier || !product || !category || !subcategory || !quantity || !price || !date) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newPurchase = new Purchase({
      supplier,
      product,
      category,
      subcategory,
      quantity: Number(quantity),
      price: Number(price),
      discount: discount || "0%",
      total: total || Number(quantity) * Number(price),
      date: new Date(date),
    });

    await newPurchase.save();
    res.status(201).json(newPurchase);
  } catch (error) {
    console.error("Create Purchase Error:", error);
    res.status(500).json({ message: "Failed to create purchase", error: error.message });
  }
};

exports.updatePurchase = async (req, res) => {
  try {
    const {
      supplier,
      product,
      category,
      subcategory,
      quantity,
      price,
      discount,
      total,
      date,
    } = req.body;

    const updateData = {
      supplier,
      product,
      category,
      subcategory,
      quantity: Number(quantity),
      price: Number(price),
      discount: discount || "0%",
      total: total || Number(quantity) * Number(price),
      date: new Date(date),
    };

    const updated = await Purchase.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Purchase not found" });
    res.json(updated);
  } catch (error) {
    console.error("Update Purchase Error:", error);
    res.status(500).json({ message: "Failed to update purchase", error: error.message });
  }
};

exports.deletePurchase = async (req, res) => {
  try {
    const deleted = await Purchase.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Purchase not found" });
    res.json({ message: "Purchase deleted successfully" });
  } catch (error) {
    console.error("Delete Purchase Error:", error);
    res.status(500).json({ message: "Failed to delete purchase", error: error.message });
  }
};
