const express = require('express');
const router = express.Router();
const { getItemByCode } = require('../controllers/billController');

// Route to fetch item by item code
router.get('/item/:code', getItemByCode);

module.exports = router;
