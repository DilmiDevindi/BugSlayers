const express = require("express");
const router = express.Router();

// const SupplierSchema = new mongoose.Schema({
//   date: { type: Date, default: Date.now },
//   supplierName: String,
//   phone1: String,
//   phone2: String,
//   fax: String,
//   email: String,
//   address: String,
//   supplyProducts: String,
//   paymentTerms: String
// });

const {
  getSuppliers,
  getSupplierCount,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");

// Define backend routes  
router.get("/", getSuppliers); // Fetch all suppliers
router.get("/count", getSupplierCount); // Get supplier count
router.get("/:id", getSupplierById); // Get a single supplier by ID
router.post("/add", createSupplier); // Create a new supplier
router.put("/:id", updateSupplier); // Update a supplier by ID
router.delete("/:id", deleteSupplier); // Delete a supplier by ID

module.exports = router;
