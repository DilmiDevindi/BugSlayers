import React, { useState, useEffect } from 'react';
import axios from 'axios';


const AddOrder = () => {
  const [form, setForm] = useState({ orderId: '', companyName: '', quantity: '', discount: '', date: '' });
  const [suppliers, setSuppliers] = useState([]);
  const [message, setMessage] = useState('');
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => { fetchSuppliers(); }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/suppliers`);
      setSuppliers(res.data);
    } catch {
      console.error("Error fetching suppliers");
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/orders`, {
        ...form,
        quantity: Number(form.quantity),
        discount: Number(form.discount),
      });
      setMessage('Order added successfully!');
      setForm({ orderId: '', companyName: '', quantity: '', discount: '', date: '' });
    } catch {
      setMessage('Error adding order. Make sure Order ID is unique.');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Order</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <input className="form-control mb-2" placeholder="Order ID" name="orderId" value={form.orderId} onChange={handleChange} />
        <select className="form-control mb-2" name="companyName" value={form.companyName} onChange={handleChange}>
          <option value="">-- Select Supplier --</option>
          {suppliers.map(s => <option key={s._id} value={s.supplierName}>{s.supplierName}</option>)}
        </select>
        <input className="form-control mb-2" type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={handleChange} />
        <input className="form-control mb-2" type="number" name="discount" placeholder="Discount" value={form.discount} onChange={handleChange} />
        <input className="form-control mb-2" type="date" name="date" value={form.date} onChange={handleChange} />
        <button className="btn btn-primary">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;
