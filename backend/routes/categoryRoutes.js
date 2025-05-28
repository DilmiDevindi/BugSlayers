const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  addCategory,
  addSubcategory,
  deleteCategory,
  updateCategory,
  addOrUpdateCategory,  // import the new controller
} = require('../controllers/categoryController');

router.get('/', getAllCategories);

// POST to add-or-update (new endpoint for your frontend)
router.post('/add-or-update', addOrUpdateCategory);

// existing routes
router.post('/add', addCategory);
router.post('/:categoryId/subcategory', addSubcategory);
router.delete('/:id', deleteCategory);
router.put('/:id', updateCategory);

module.exports = router;
