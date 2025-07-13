const express = require("express");
const router = express.Router();
const PurchaseController = require("../controllers/purchaseController");

// Use the correct exported function names here:
router.get("/", PurchaseController.getPurchases);
router.post("/", PurchaseController.createPurchase);
router.put("/:id", PurchaseController.updatePurchase);
router.delete("/:id", PurchaseController.deletePurchase);

module.exports = router;
