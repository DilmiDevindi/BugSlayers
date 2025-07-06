import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';

const OrderReport = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        params: { startDate, endDate },
      });
      setOrders(
        res.data.filter((order) => {
          const orderDate = new Date(order.date);
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          return orderDate >= start && orderDate <= end;
        })
      );
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Failed to fetch report. Please check server and date formats.'
      );
      setOrders([]);
    }
  };

  const generatePDF = () => {
    if (orders.length === 0) {
      alert('No data to generate report.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Order Report', 20, 15);
    doc.setFontSize(11);
    doc.text(`From: ${startDate} To: ${endDate}`, 20, 25);

    const colWidth = [10, 40, 30, 30, 40];
    let y = 35;

    // Header row
    const headers = ['#', 'Order ID', 'Quantity', 'Discount (%)', 'Date'];
    let x = 20;
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += colWidth[i];
    });
    y += 8;

    // Rows
    orders.forEach((order, index) => {
      let x = 20;
      const row = [
        (index + 1).toString(),
        order.orderId,
        order.quantity.toString(),
        order.discount.toString(),
        new Date(order.date).toLocaleDateString(),
      ];
      row.forEach((text, i) => {
        doc.text(text, x, y);
        x += colWidth[i];
      });
      y += 8;
    });

    doc.save('order_report.pdf');
  };

  const clearReport = () => {
    setStartDate('');
    setEndDate('');
    setOrders([]);
    setError(null);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Order Report</h2>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/dashboard/orders/manage')}
        >
          ⬅ Back to Manage Orders
        </button>
      </div>

      <div className="row mb-3 align-items-end">
        <div className="col-md-3">
          <label>Start Date</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label>End Date</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="col-md-6 d-flex justify-content-start gap-2">
          <button className="btn btn-primary" onClick={fetchReport}>
            View Report
          </button>
          <button
            className="btn btn-success"
            onClick={generatePDF}
            disabled={orders.length === 0}
            title={orders.length === 0 ? 'No data to download' : ''}
          >
            Download Report
          </button>
        </div>
      </div>

      {error && <p className="text-danger">{error}</p>}

      {orders.length > 0 ? (
        <>
          <table className="table table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Quantity</th>
                <th>Discount (%)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, idx) => (
                <tr key={order._id}>
                  <td>{idx + 1}</td>
                  <td>{order.orderId}</td>
                  <td>{order.quantity}</td>
                  <td>{order.discount}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Clear button shown only when data exists */}
          <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-warning" onClick={clearReport}>
              Clear
            </button>
          </div>
        </>
      ) : (
        <p>No report data to show.</p>
      )}
    </div>
  );
};

export default OrderReport;
