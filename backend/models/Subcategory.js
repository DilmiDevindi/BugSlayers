const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  subcategoryName: {
    type: String,
    required: true
  },