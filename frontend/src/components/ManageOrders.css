import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({});
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const res = await axios.get(`${BASE_URL}/api/orders`);
    setOrders(res.data);
  };

  const handleEdit = (order) => {
    setEditingId(order._id);
    setForm(order);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await axios.put(`${BASE_URL}/api/orders/${editingId}`, form);
    setEditingId(null);
    fetchOrders();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${BASE_URL}/api/orders/${id}`);
    fetchOrders();
  };

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Company</th>
            <th>Quantity</th>
            <th>Discount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) =>
            editingId === order._id ? (
              <tr key={order._id}>
                <td><input name="orderId" value={form.orderId} onChange={handleChange} /></td>
                <td><input name="companyName" value={form.companyName} onChange={handleChange} /></td>
                <td><input name="quantity" type="number" value={form.quantity} onChange={handleChange} /></td>
                <td><input name="discount" type="number" value={form.discount} onChange={handleChange} /></td>
                <td><input name="date" type="date" value={form.date?.slice(0,10)} onChange={handleChange} /></td>
                <td>
                  <button className="btn btn-success btn-sm me-2" onClick={handleSave}>Save</button>
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.companyName}</td>
                <td>{order.quantity}</td>
                <td>{order.discount}</td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(order)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order._id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
