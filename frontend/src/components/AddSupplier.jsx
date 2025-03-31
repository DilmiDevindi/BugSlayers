import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const AddSupplier = () => {
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0],
    supplierName: '',
    phone: '',
    phone2: '', // Optional second phone number
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!supplier.date) {
      alert('Date is required.');
      return;
    }

    if (supplier.phone.length !== 10) {
      alert('Primary Contact Number must be exactly 10 digits.');
      return;
    }

    if (supplier.phone2 && supplier.phone2.length !== 10) {
      alert('Secondary Contact Number must be exactly 10 digits if entered.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/suppliers', supplier);
      alert('Supplier added successfully');
      setSupplier({
        date: new Date().toISOString().split('T')[0],
        supplierName: '',
        phone: '',
        phone2: '',
        fax: '',
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
    const { name, value } = e.target;
    if (/^\d{0,10}$/.test(value)) {
      setSupplier({ ...supplier, [name]: value });
    } else {
      alert('Phone Number cannot exceed 10 digits.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add Supplier</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            value={supplier.date}
            onChange={(e) => setSupplier({ ...supplier, date: e.target.value })}
            required
            autoComplete="off"
          />
        </div>

        {[{ label: "Supplier Name", key: "supplierName" }, { label: "Contact Number (Primary)", key: "phone", required: true }, { label: "Contact Number (Secondary)", key: "phone2", required: false }, { label: "Fax Number", key: "fax", required: false }, { label: "Email Address", key: "email" }, { label: "Address", key: "address" }].map(field => (
          <div key={field.key} className="mb-3">
            <label className="form-label">{field.label}</label>
            <input
              type="text"
              className="form-control"
              name={field.key}
              value={supplier[field.key]}
              onChange={field.key.includes('phone') ? handlePhoneChange : (e) => setSupplier({ ...supplier, [field.key]: e.target.value })}
              {...(field.required === false ? {} : { required: true })}
              autoComplete="off"
            />
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Supply Products</label>
          <select
            className="form-control"
            value={supplier.supplyProducts}
            onChange={(e) => setSupplier({ ...supplier, supplyProducts: e.target.value })}
            required
            autoComplete="off"
          >
            <option value="" disabled>Select a product</option>
            <option value="Mattress">Mattress</option>
            <option value="Cupboard">Cupboard</option>
            <option value="Scupboard">Steel Melamine Cupboard</option>
            <option value="Chair">Chair</option>
            <option value="Pchair">Plastic Chair</option>
            <option value="Table">Table</option>
            <option value="Wtable">Writing Table</option>
            <option value="Iron Board">Iron Board</option>
            <option value="Clothes Rack">Clothes Rack</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select
            className="form-control"
            value={supplier.paymentTerms}
            onChange={(e) => setSupplier({ ...supplier, paymentTerms: e.target.value })}
            required
            autoComplete="off"
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
