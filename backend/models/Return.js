
const mongoose = require("mongoose");

const ReturnSchema = new mongoose.Schema(
  {
    returnId: { type: String, required: true, unique: true },
    companyName: { type: String, required: true },
    date: { type: Date, required: true },
    product: { type: String, required: true },
    quantity: { type: Number, required: true, min: [1, "Quantity must be at least 1"] },
    productPrice: { type: Number, required: true, min: [0, "Product price cannot be negative"] },
    totalReturnPrice: { type: Number, required: true, min: [0, "Total return price cannot be negative"] },
    status: { type: String, required: true, enum: ["Pending", "Approved", "Rejected"] },
    note: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Return", ReturnSchema);
