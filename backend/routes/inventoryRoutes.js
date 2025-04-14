const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this folder exists in your project
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

const {
  getInventoryItems,
  addInventoryItem,
  getInventoryCount,
  updateInventoryItem,
  deleteInventoryItem,
} = require('../controllers/inventoryController');

// Routes
router.get('/', getInventoryItems);                         // Fetch all items
router.post('/add', upload.single('image'), addInventoryItem); //  Add with image
router.get('/count', getInventoryCount);                    // Inventory count
router.put('/:id', upload.single('image'), updateInventoryItem); // Update with image
router.delete('/:id', deleteInventoryItem);                 // Delete

module.exports = router;
