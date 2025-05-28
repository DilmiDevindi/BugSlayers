const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  subcategories: [
    {
      type: String,
      trim: true,
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
