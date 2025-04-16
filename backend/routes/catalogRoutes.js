// routes/catalogRoutes.js

const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Route to get all categories
router.get('/categories', catalogController.getCategories);


// Route to get products by category ID
router.get('/', getInventoryItems); // This supports `?categoryId=...` as expected


module.exports = router;
