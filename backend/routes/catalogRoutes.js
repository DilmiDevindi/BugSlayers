// routes/catalogRoutes.js

const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Route to get all products
router.get('/inventory', catalogController.getAllProducts);

module.exports = router;