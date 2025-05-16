const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.get('/', orderController.getAllOrders); // Get all orders
router.post('/', orderController.createOrder); // Create a new order
router.get('/:id', orderController.getOrderById); // Get a specific order by ID
router.put('/:id', orderController.updateOrder); // Update an order by ID
router.delete('/:id', orderController.deleteOrder); // Delete an order by ID

module.exports = router;