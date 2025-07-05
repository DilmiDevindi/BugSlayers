const express = require('express');
const router = express.Router();
const { getItemByCode } = require('../controllers/billController');

// Fetch item using code
router.get('/item/:code', getItemByCode);

module.exports = router;
