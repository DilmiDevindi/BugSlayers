const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    contact: { type: String, required: true },
    date: { type: Date, required: true }, // Ensure the date field is defined and required
});

module.exports = mongoose.model('Customer', customerSchema);
