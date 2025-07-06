import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    quantity: '',
    discount: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    if (!newOrder.orderId || !newOrder.quantity || !newOrder.discount || !newOrder.date) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await axios.post('/api/orders', newOrder);
      setOrders((prev) => [...prev, res.data]);

      // Reset form
      setNewOrder({
        orderId: '',
        quantity: '',
        discount: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (err) {
      console.error('Failed to add order:', err);
      alert('Failed to add order.');
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Orders</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by Order ID or Date"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="card p-3 mb-4">
        <h5>Add New Order</h5>
        <div className="row">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              name="orderId"
              placeholder="Order ID"
              value={newOrder.orderId}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="quantity"
              placeholder="Quantity"
              value={newOrder.quantity}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="discount"
              placeholder="Discount (%)"
              value={newOrder.discount}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              name="date"
              value={newOrder.date}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleAddOrder}>
              Add Order
            </button>
          </div>
        </div>
      </div>

      <h5>Order List</h5>
      <table className="table table-striped">
        <thead className="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Quantity</th>
            <th>Discount (%)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, idx) => (
            <tr key={idx}>
              <td>{order.orderId}</td>
              <td>{order.quantity}</td>
              <td>{order.discount}</td>
              <td>{order.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageOrders;
