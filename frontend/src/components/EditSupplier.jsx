// components/EditSupplier.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({
    date: new Date().toISOString().split('T')[0], // Default to today's date
    supplierName: '',
    phone: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: ''
  });

  useEffect(() => {
    if (id) {
      const fetchSupplier = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
          setSupplier(response.data);
        } catch (error) {
          console.error('Error fetching supplier:', error);
        }
      };
      fetchSupplier();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Ensure phone and fax are only numeric
    if ((name === 'phone' || name === 'fax') && isNaN(value)) {
      return;
    }

    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number length if entered
    if (supplier.phone && supplier.phone.length !== 10) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/suppliers/${id}`, supplier);
      } else {
        await axios.post('http://localhost:5000/api/suppliers', supplier);
      }
      navigate('/dashboard/suppliers/manage'); // Redirect after successful update
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? 'Edit Supplier' : 'Add New Supplier'}</h2>
      <form onSubmit={handleSubmit}>

        {/* Date Field */}
        <div className="mb-3">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-control"
            name="date"
            value={supplier.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Supplier Name */}
        <div className="mb-3">
          <label className="form-label">Supplier Name</label>
          <input
            type="text"
            className="form-control"
            name="supplierName"
            value={supplier.supplierName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={supplier.phone}
            onChange={handleChange}
          />
        </div>

        {/* Fax Number (New Field) */}
        <div className="mb-3">
          <label className="form-label">Fax</label>
          <input
            type="text"
            className="form-control"
            name="fax"
            value={supplier.fax}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={supplier.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={supplier.address}
            onChange={handleChange}
            required
          />
        </div>

        {/* Supply Products */}
        <div className="mb-3">
          <label className="form-label">Supply Products</label>
          <input
            type="text"
            className="form-control"
            name="supplyProducts"
            value={supplier.supplyProducts}
            onChange={handleChange}
            required
          />
        </div>

        {/* Payment Terms */}
        <div className="mb-3">
          <label className="form-label">Payment Terms</label>
          <input
            type="text"
            className="form-control"
            name="paymentTerms"
            value={supplier.paymentTerms}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {id ? 'Update Supplier' : 'Add Supplier'}
        </button>
      </form>
    </div>
  );
};

export default EditSupplier;
