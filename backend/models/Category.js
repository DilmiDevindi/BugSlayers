const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  subcategories: [
    {
      type: String,
    },
  ],
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
