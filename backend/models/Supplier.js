const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  supplierName: {
    type: String,
    required: true,
  },
  phone1: {
    type: String,
    required: true,
  },
  phone2: {
    type: String,
  },
  fax: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  supplyProducts: {
    type: String,
    required: true,
  },
  paymentTerms: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Supplier', SupplierSchema);
