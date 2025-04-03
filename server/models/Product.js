const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        image: String,
        title: String,
        description: String,
        category: String,
        brand: String,
        price: Number,
        salePrice: Number, // Fixed typo (changed SalePrice -> salePrice)
        totalStock: Number,
    },
    { timestamps: true } // Keeps track of createdAt and updatedAt automatically
);

module.exports = mongoose.model('Product', ProductSchema);
