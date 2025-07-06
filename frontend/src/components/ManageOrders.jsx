import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({
    orderId: '',
    quantity: '',
    discount: '',
    date: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [editedOrder, setEditedOrder] = useState({
    orderId: '',
    quantity: '',
    discount: '',
    date: '',
  });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, startDate, endDate]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders');
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      setError(`Failed to fetch orders: ${error.response?.data?.error || error.message}`);
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (!startDate || !endDate) {
      setFilteredOrders(orders);
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = orders.filter((order) => {
      const orderDate = new Date(order.date);
      return orderDate >= start && orderDate <= end;
    });

    setFilteredOrders(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrder = async () => {
    const { orderId, quantity, discount, date } = newOrder;
    if (!orderId || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/orders', {
        orderId,
        quantity: Number(quantity),
        discount: Number(discount),
        date: new Date(date).toISOString(),
      });
      setOrders([res.data, ...orders]);
      setNewOrder({ orderId: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to add order: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleEditClick = (order) => {
    setEditingId(order._id);
    const formattedDate = new Date(order.date).toISOString().split('T')[0];
    setEditedOrder({
      orderId: order.orderId,
      quantity: order.quantity,
      discount: order.discount,
      date: formattedDate,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (id) => {
    const { orderId, quantity, discount, date } = editedOrder;
    if (!orderId || !quantity || !discount || !date) {
      setError('Please fill all fields');
      return;
    }

    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${id}`, {
        orderId,
        quantity: Number(quantity),
        discount: Number(discount),
        date: new Date(date).toISOString(),
      });
      setOrders((prev) => prev.map((order) => (order._id === id ? res.data : order)));
      setEditingId(null);
      setEditedOrder({ orderId: '', quantity: '', discount: '', date: '' });
      setError(null);
    } catch (err) {
      setError(`Failed to update order: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedOrder({ orderId: '', quantity: '', discount: '', date: '' });
    setError(null);
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Order Report', 20, 10);
    doc.setFontSize(12);
    doc.text(`From: ${startDate || 'All'} To: ${endDate || 'All'}`, 20, 20);
    let y = 30;

    filteredOrders.forEach((order) => {
      doc.text(
        `Order ID: ${order.orderId}, Qty: ${order.quantity}, Discount: ${order.discount}%, Date: ${new Date(order.date).toLocaleDateString()}`,
        10,
        y
      );
      y += 10;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save('order_report.pdf');
  };

  return (
    <div className="container mt-4">
      <h2>Manage Orders</h2>

      <table className="table table-bordered mb-4">
        <thead className="table-light">
          <tr>
            <th>Order ID</th>
            <th>Quantity</th>
            <th>Discount (%)</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" name="orderId" className="form-control" value={newOrder.orderId} onChange={handleInputChange} /></td>
            <td><input type="number" name="quantity" className="form-control" value={newOrder.quantity} onChange={handleInputChange} /></td>
            <td><input type="number" name="discount" className="form-control" value={newOrder.discount} onChange={handleInputChange} /></td>
            <td><input type="date" name="date" className="form-control" value={newOrder.date} onChange={handleInputChange} /></td>
            <td><button className="btn btn-success" onClick={handleAddOrder}>Add</button></td>
          </tr>
        </tbody>
      </table>

      {error && <p className="text-danger">{error}</p>}
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          <table className="table table-striped">
            <thead className="table-dark">
              <tr>
                <th>Order ID</th>
                <th>Quantity</th>
                <th>Discount (%)</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) =>
                editingId === order._id ? (
                  <tr key={order._id}>
                    <td><input type="text" name="orderId" className="form-control" value={editedOrder.orderId} onChange={handleEditChange} /></td>
                    <td><input type="number" name="quantity" className="form-control" value={editedOrder.quantity} onChange={handleEditChange} /></td>
                    <td><input type="number" name="discount" className="form-control" value={editedOrder.discount} onChange={handleEditChange} /></td>
                    <td><input type="date" name="date" className="form-control" value={editedOrder.date} onChange={handleEditChange} /></td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleSaveEdit(order._id)}>Save</button>
                      <button className="btn btn-secondary btn-sm" onClick={handleCancelEdit}>Cancel</button>
                    </td>
                  </tr>
                ) : (
                  <tr key={order._id}>
                    <td>{order.orderId}</td>
                    <td>{order.quantity}</td>
                    <td>{order.discount}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td><button className="btn btn-warning btn-sm" onClick={() => handleEditClick(order)}>Edit</button></td>
                  </tr>
                )
              )}
            </tbody>
          </table>

          {/* Filter Dates - Placed Below Table */}
          <div className="row my-4">
            <div className="col-md-6">
              <label>Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label>End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="text-end">
            <button className="btn btn-outline-primary" onClick={handleDownloadPDF}>
              Download Filtered Report PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageOrders;
