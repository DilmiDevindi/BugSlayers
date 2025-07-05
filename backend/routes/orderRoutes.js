const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Order routes
router.get('/', orderController.getAllOrders); // Get all orders
router.post('/', orderController.createOrder); // Create new order
router.get('/:id', orderController.getOrderById); // Get by ID
router.put('/:id', orderController.updateOrder); // Update by ID
router.delete('/:id', orderController.deleteOrder); // Delete by ID