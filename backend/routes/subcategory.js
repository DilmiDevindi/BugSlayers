const express = require('express');
const router = express.Router();
const Subcategory = require('../models/Subcategory');

// Create a new subcategory
router.post('/', async (req, res) => {
  try {
    const { subcategoryName, categoryId } = req.body;

    const newSubcategory = new Subcategory({
      subcategoryName,
      categoryId
    });
