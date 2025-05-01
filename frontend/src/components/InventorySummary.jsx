import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";

const InventorySummary = () => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stockTrends, setStockTrends] = useState([]);

  useEffect(() => {
    // Fetch inventory items and categories from API
    fetchInventoryItems();
    fetchCategories();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/inventory');
      const data = await response.json();
      setInventoryItems(data);

      // Pie and Bar data based on inventory items
      const pieCategories = {};
      const barItems = [];

      data.forEach(item => {
        // Pie Data Preparation
        pieCategories[item.category] = (pieCategories[item.category] || 0) + item.quantity;

        // Bar Data Preparation
        barItems.push({ itemName: item.name, quantity: item.quantity });
      });

      setPieData(Object.entries(pieCategories).map(([category, quantity]) => ({ category, value: quantity })));
      setBarData(barItems);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/category');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const toggleExpand = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Inventory Summary Report</h1>
        <p className="text-muted">A comprehensive overview of your current inventory, categorized by stock, sales trends, and more.</p>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Inventory</h5>
              <p className="h4">{inventoryItems.length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info">Categories</h5>
              <p className="h4">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">Out of Stock</h5>
              <p className="h4">{inventoryItems.filter(item => item.quantity === 0).length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Low Stock</h5>
              <p className="h4">{inventoryItems.filter(item => item.quantity < 5).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
        <div className="input-group w-auto">
          <label className="input-group-text">Category</label>
          <select className="form-select">
            <option value="">All</option>
            {categories.map((category, idx) => (
              <option key={idx} value={category.name}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="input-group w-auto">
          <label className="input-group-text">From</label>
          <input type="date" className="form-control" />
        </div>
        <div className="input-group w-auto">
          <label className="input-group-text">To</label>
          <input type="date" className="form-control" />
        </div>
        <input className="form-control w-auto" type="search" placeholder="Search by item..." />
      </div>

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <h5 className="mb-3">Stock Distribution by Category</h5>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={["#0d6efd", "#198754", "#dc3545", "#ffc107"][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <h5 className="mb-3">Top Stocked Items</h5>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="itemName" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Value Trends */}
      <div className="mb-5">
        <h5 className="mb-3">Stock Value Trends</h5>
        <div className="card shadow-sm p-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#28a745" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="table-responsive">
        <h5 className="mb-3">Inventory Details</h5>
        <div className="card shadow-sm">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {inventoryItems.map((item, index) => (
                <React.Fragment key={index}>
                  <tr onClick={() => toggleExpand(index)} style={{ cursor: "pointer" }}>
                    <td>{item.code}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                  </tr>
                  {expandedRow === index && (
                    <tr>
                      <td colSpan="5">
                        <div className="p-3 bg-light rounded d-flex justify-content-between align-items-center">
                          <div>
                            <strong>Supplier:</strong> {item.supplier} <br />
                            <strong>Date Added:</strong> {item.date}
                          </div>
                          <img src={item.img} alt={item.name} height="80" className="rounded shadow-sm" />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="d-flex justify-content-end gap-3 mt-4">
        <button className="btn btn-outline-secondary">Export CSV</button>
        <button className="btn btn-outline-danger">Export PDF</button>
        <button className="btn btn-outline-dark" onClick={() => window.print()}>Print Report</button>
      </div>
    </div>
  );
};

      


