const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
  returnId: { 
    type: String, 
    unique: true,
    required: true
  },
  supplier: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  product: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ["Pending", "Returned", "Cancel"],
    default: "Pending"
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate return ID before saving
returnSchema.pre('save', async function(next) {
  if (!this.returnId) {
    const lastReturn = await this.constructor.findOne().sort({ _id: -1 }).limit(1);
    if (lastReturn && lastReturn.returnId) {
      const lastId = parseInt(lastReturn.returnId.split("-")[1]);
      this.returnId = `RET-${(lastId + 1).toString().padStart(3, "0")}`;
    } else {
      this.returnId = "RET-001";
    }
  }
  next();
});

module.exports = mongoose.model("Return", returnSchema);