const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');


// Multer configuration for handling image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Controller functions
const {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');



// GET all inventory items
router.get('/', getInventoryItems);

// POST a new inventory item with image upload
router.post('/add', upload.single('image'), addInventoryItem);

// GET total inventory item count
router.get('/count', getInventoryCount);

// PUT (update) an inventory item by ID
router.put('/:id', upload.single('image'), updateInventoryItem);

// DELETE an inventory item by ID
router.delete('/:id', deleteInventoryItem);

module.exports = router;
