const express = require("express");
const router = express.Router();
const refundController = require("../controllers/refundController");

// GET all refunds
router.get("/", refundController.getAllRefunds);

// CREATE refund
router.post("/", refundController.createRefund);

// UPDATE refund
router.put("/:id", refundController.updateRefund);

// DELETE refund
router.delete("/:id", refundController.deleteRefund);

module.exports = router;