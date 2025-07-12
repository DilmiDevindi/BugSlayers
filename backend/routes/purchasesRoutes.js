const express = require("express");
const router = express.Router();
const PurchaseController = require("../controllers/purchaseController");

router.get("/", PurchaseController.getAllPurchases);
router.post("/", PurchaseController.createPurchase);
router.put("/:id", PurchaseController.updatePurchase);
router.delete("/:id", PurchaseController.deletePurchase);

module.exports = router;