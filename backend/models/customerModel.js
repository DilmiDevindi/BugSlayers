const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String, 
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const Customer = mongoose.model('customers', customerSchema);

module.exports = Customer;
