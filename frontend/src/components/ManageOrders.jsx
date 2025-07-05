import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [newOrder, setNewOrder] = useState({
    orderId: '',
    quantity: '',
    discount: '',
    date: new Date().toISOString().split('T')[0], // today's date
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrder = async () => {
    const { orderId, quantity, discount, date } = newOrder;

    // Basic validation
    if (!orderId || !quantity || !discount || !date) {
      alert('Please fill all fields');
      return;
    }

    const newEntry = { orderId, quantity, discount, date };

    try {
      // Send to backend (optional: remove if not needed)
      const response = await axios.post('/api/orders/add', newEntry);

      // Add to frontend state
      setOrders((prev) => [...prev, response.data]);

      // Clear form
      setNewOrder({
        orderId: '',
        quantity: '',
        discount: '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order.');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>

      {/* Search Input */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Order ID or Date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Order Entry Form */}
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
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="quantity"
              placeholder="Quantity"
              value={newOrder.quantity}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              name="discount"
              placeholder="Discount (%)"
              value={newOrder.discount}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-3">
            <input
              type="date"
              className="form-control"
              name="date"
              value={newOrder.date}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" onClick={handleAddOrder}>
              Add Order
            </button>
          </div>
        </div>
      </div>

      {/* Order Table */}
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
          {filteredOrders.map((order) => (
            <tr key={order._id || order.orderId}>
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
