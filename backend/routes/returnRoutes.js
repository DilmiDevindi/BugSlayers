const express = require("express");
const router = express.Router();
const returnController = require("../controllers/returnController");

// Get all returns
router.get("/", returnController.getAllReturns);

// Create a new return
router.post("/", returnController.createReturn);

// Update a return
router.put("/:id", returnController.updateReturn);

// Delete a return
router.delete("/:id", returnController.deleteReturn);

module.exports = router;