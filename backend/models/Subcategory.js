const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  subcategoryName: {
    type: String,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
});