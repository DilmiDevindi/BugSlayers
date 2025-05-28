const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
        required: true,
        unique: true // optional: to prevent duplicate category names
    },
    subcategories: [
        {
            type: String
        }
    ]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
