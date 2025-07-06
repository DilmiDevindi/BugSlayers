const express = require('express');
  const router = express.Router();
  const orderController = require('../controllers/orderController');

  router.get('/', orderController.getAllOrders);
  router.post('/', orderController.createOrder);
  router.put('/:id', orderController.updateOrder);

  // New route for report with date range (kept for potential future use)
  router.get('/report', orderController.getOrderReport);

  module.exports = router;