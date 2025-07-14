// routes/purchaseReportRoutes.js
const express = require('express');
const router = express.Router();
const { getOutSidePurchases } = require('../controllers/purchaseReportsController');

// Route: GET /api/reports/purchases
// Description: Get all purchases with ProductStatus = 'Out-Side' filtered by optional date range
router.get('/purchases', getOutSidePurchases);

module.exports = router;
