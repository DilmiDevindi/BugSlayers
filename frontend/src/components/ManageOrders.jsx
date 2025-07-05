import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [newOrder, setNewOrder] = useState({
    orderId: '',
    supplierName: '',
    phone: '',
    email: '',
    quantity: '',
    discount: '',
    amountPaid: '',
    status: 'Not Paid',
    date: new Date().toISOString().split('T')[0],
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
    const {
      orderId,
      supplierName,
      phone,
      email,
      quantity,
      discount,
      amountPaid,
      status,
      date,
    } = newOrder;

    if (
      !orderId ||
      !supplierName ||
      !phone ||
      !email ||
      !quantity ||
      !discount ||
      !amountPaid ||
      !status ||
      !date
    ) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post('/api/orders', newOrder);
      setOrders((prev) => [...prev, response.data]);

      // Reset form
      setNewOrder({
        orderId: '',
        supplierName: '',
        phone: '',
        email: '',
        quantity: '',
        discount: '',
        amountPaid: '',
        status: 'Not Paid',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Failed to add order.');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.date?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>

      {/* Search Field */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Order ID or Date"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Add Order Form */}
      <div className="card p-3 mb-4">
        <h5>Add New Order</h5>
        <div className="row g-2">
          {[
            { name: 'orderId', label: 'Order ID', type: 'text' },
            { name: 'supplierName', label: 'Supplier Name', type: 'text' },
            { name: 'phone', label: 'Phone', type: 'text' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'quantity', label: 'Quantity', type: 'number' },
            { name: 'discount', label: 'Discount (%)', type: 'number' },
            { name: 'amountPaid', label: 'Amount Paid', type: 'number' },
          ].map((field) => (
            <div className="col-md-3" key={field.name}>
              <input
                type={field.type}
                className="form-control"
                name={field.name}
                placeholder={field.label}
                value={newOrder[field.name]}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <div className="col-md-3">
            <select
              name="status"
              className="form-control"
              value={newOrder.status}
              onChange={handleInputChange}
            >
              <option value="Not Paid">Not Paid</option>
              <option value="Paid">Paid</option>
            </select>
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

          <div className="col-md-3">
            <button className="btn btn-primary w-100" onClick={handleAddOrder}>
              Add Order
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <h5>Order List</h5>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Order ID</th>
              <th>Supplier Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Quantity</th>
              <th>Discount (%)</th>
              <th>Amount Paid</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>{order.supplierName}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td>{order.quantity}</td>
                <td>{order.discount}</td>
                <td>{order.amountPaid}</td>
                <td>{order.status}</td>
                <td>{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
