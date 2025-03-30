import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today's date
    supplierName: '',
    phone: '',
    fax: '', // Added fax field (not required)
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Date Field
    if (!supplier.date) {
      alert('Date is required.');
      return;
    }

    // Validate phone number length
    if (supplier.phone.length !== 10) {
      alert('Contact Number must be exactly 10 digits.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers', supplier);
      alert('Supplier added successfully');
      setSupplier({
        date: new Date().toISOString().split('T')[0], // Reset to today's date
        supplierName: '',
        phone: '',
        fax: '', // Reset fax
        email: '',
        address: '',
        supplyProducts: '',
        paymentTerms: '',
      });
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setSupplier({ ...supplier, phone: value });
    } else {
      alert('Contact Number cannot exceed 10 digits.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit}>

        {/* Date Field */}
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label me-3" style={{ minWidth: "150px" }}>Date</label>
          <input
            type="date"
            className="form-control w-50"
            value={supplier.date}
            onChange={(e) => setSupplier({ ...supplier, date: e.target.value })}
            required
          />
        </div>

        {/* Other Input Fields */}
        {[
          { label: "Supplier Name", key: "supplierName", type: "text" },
          { label: "Contact Number", key: "phone", type: "tel", onChange: handlePhoneChange },
          { label: "Fax Number", key: "fax", type: "text", required: false }, // Added Fax field (optional)
          { label: "Email Address", key: "email", type: "email" },
          { label: "Address", key: "address", type: "text" },
        ].map((field) => (
          <div key={field.key} className="mb-3 d-flex align-items-center">
            <label className="form-label me-3" style={{ minWidth: "150px" }}>
              {field.label}
            </label>
            <input
              type={field.type}
              className="form-control w-50"
              value={supplier[field.key]}
              onChange={field.onChange || ((e) => setSupplier({ ...supplier, [field.key]: e.target.value }))}
              {...(field.required === false ? {} : { required: true })} // Make Fax optional
            />
          </div>
        ))}

        {/* Supply Products - Dropdown Selection */}
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label me-3" style={{ minWidth: "150px" }}>Supply Products</label>
          <select
            className="form-control w-50"
            value={supplier.supplyProducts}
            onChange={(e) => setSupplier({ ...supplier, supplyProducts: e.target.value })}
            required
          >
            <option value="" disabled>Select a product</option>
            <option value="Mattress">Mattress</option>
            <option value="Cushion">Cushion</option>
          </select>
        </div>

        {/* Payment Methods - Dropdown Selection */}
        <div className="mb-3 d-flex align-items-center">
          <label className="form-label me-3" style={{ minWidth: "150px" }}>Payment Method</label>
          <select
            className="form-control w-50"
            value={supplier.paymentTerms}
            onChange={(e) => setSupplier({ ...supplier, paymentTerms: e.target.value })}
            required
          >
            <option value="" disabled>Select a payment method</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">Add Supplier</button>
      </form>
    </div>
  );
};

export default AddSupplier;
