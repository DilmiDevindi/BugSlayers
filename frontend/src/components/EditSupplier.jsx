import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Supplier.css';

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState({
    date: '',
    supplierName: '',
    phone1: '',
    phone2: '',
    fax: '',
    email: '',
    address: '',
    supplyProducts: '',
    paymentTerms: '',
  });

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/suppliers/${id}`);
      setSupplier(res.data);
    } catch (err) {
      console.error('Error fetching supplier:', err);
      alert('Failed to fetch supplier data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:5000/api/suppliers/update/${id}`, supplier);
      alert('Supplier updated successfully');
      navigate('/manage-suppliers');
    } catch (err) {
      console.error('Error updating supplier:', err);
      alert('Failed to update supplier');
    }
  };

  return (
    <div className="container-i mt-4">
      <h2 className="text-center mb-4">Edit Supplier</h2>
      <form onSubmit={handleSubmit} className="supplier-form">
        <div className="form-group">
          <label>Date:</label>
          <input type="date" className="form-control" name="date" value={supplier.date} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Supplier Name:</label>
          <input type="text" className="form-control" name="supplierName" value={supplier.supplierName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contact Number (Primary):</label>
          <input type="text" className="form-control" name="phone1" value={supplier.phone1} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Contact Number (Secondary):</label>
          <input type="text" className="form-control" name="phone2" value={supplier.phone2} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Fax:</label>
          <input type="text" className="form-control" name="fax" value={supplier.fax} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" className="form-control" name="email" value={supplier.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Address:</label>
          <textarea className="form-control" name="address" value={supplier.address} onChange={handleChange}></textarea>
        </div>
        <div className="form-group">
          <label>Supplied Products:</label>
          <input type="text" className="form-control" name="supplyProducts" value={supplier.supplyProducts} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Payment Terms:</label>
          <input type="text" className="form-control" name="paymentTerms" value={supplier.paymentTerms} onChange={handleChange} />
        </div>
        <button type="submit" className="btn btn-success btn-block">Update Supplier</button>
      </form>
    </div>
  );
};

export default EditSupplier;
