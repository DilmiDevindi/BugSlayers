import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import './InventorySummary.css';

const COLORS = ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

const InventorySummary = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

  useEffect(() => {
    fetchInventoryItems();
    fetchCategories();
  }, []);

  const fetchInventoryItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setInventoryItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching inventory items:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/category');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    const pieMap = {};
    const lineTemp = [];

    inventoryItems.forEach((it) => {
      pieMap[it.category] = (pieMap[it.category] || 0) + (it.quantity || 0);
      lineTemp.push({
        date: it.dateAdded,
        value: (it.quantity || 0) * (it.sellingPrice || 0),
      });
    });

    setPieData(
      Object.entries(pieMap).map(([id, val]) => ({
        category: getCategoryName(id),
        value: val,
      }))
    );

    const topItems = inventoryItems
      .map((it) => ({ inventoryItem: it.productName, quantity: it.quantity || 0 }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    setBarData(topItems);

    setLineData(lineTemp);
  }, [inventoryItems, categories]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : 'Unknown';
  };

  const totalValue = inventoryItems.reduce(
    (sum, it) => sum + (it.quantity || 0) * (it.sellingPrice || 0),
    0
  );

  const totalCategories = categories.length;
  const totalItems = inventoryItems.length;
  const totalOrders = 120; // placeholder
  const totalUsers = 35;   // placeholder

  const generateCSVData = () => {
    const headers = [
      'No',
      'Product',
      'SKU',
      'Category',
      'Opening Stock',
      'Purchased',
      'Sold',
      'Closing Stock',
      'Unit Price (Rs)',
      'Total Value (Rs)'
    ];
    const rows = inventoryItems.map((item, i) => {
      const total = (item.quantity || 0) * (item.sellingPrice || 0);
      return [
        i + 1,
        item.productName,
        item.itemCode,
        getCategoryName(item.category),
        item.openingStock || 0,
        item.purchases || 0,
        item.sales || 0,
        item.quantity || 0,
        (item.sellingPrice || 0).toFixed(2),
        total.toFixed(2)
      ];
    });
    return [headers, ...rows];
  };

  return (
    <div className="inventory-report-wrapper">
      <header className="report-header">
        <div className="logo-section">
          <img src="/logo.png" alt="Company Logo" className="company-logo" />
        </div>
        <div className="company-info">
          <h2>New Sisira Furniture</h2>
          <p>No 156, Sisira Furniture, Matara Road, Kamburupitiya</p>
          <p>077-3211603 | 071-8006485</p>
          <p>sisirafurniture@gmail.com</p>
        </div>
      </header>

      <div className="title-date">
        <h3>Inventory Report</h3>
        <p>Date: {new Date().toLocaleDateString()}</p>
      </div>

      <section className="summary-cards">
        <div className="summary-card card-blue">
          <div className="card-icon">📦</div>
          <div>
            <h4>{totalItems}</h4>
            <p>Total Inventory Items</p>
          </div>
        </div>
        <div className="summary-card card-green">
          <div className="card-icon">📂</div>
          <div>
            <h4>{totalCategories}</h4>
            <p>Total Categories</p>
          </div>
        </div>
        <div className="summary-card card-red">
          <div className="card-icon">🛒</div>
          <div>
            <h4>{totalOrders}</h4>
            <p>Total Orders</p>
          </div>
        </div>
        <div className="summary-card card-yellow">
          <div className="card-icon">👥</div>
          <div>
            <h4>{totalUsers}</h4>
            <p>Total Users</p>
          </div>
        </div>
      </section>

      <section className="charts-row">
        <div className="chart-container half-chart">
          <h5>Stock Distribution by Category</h5>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={60}
                label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} items`} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container half-chart">
          <h5>Top 10 Stocked Items</h5>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
              <XAxis dataKey="inventoryItem" angle={-45} textAnchor="end" height={60} />
              <YAxis label={{ value: 'Qty', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#0d6efd" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="charts-row">
        <div className="chart-container full-chart">
          <h5>Inventory Value Trend</h5>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={lineData} margin={{ top: 10, right: 30, left: 20, bottom: 30 }}>
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => new Date(tick).toLocaleDateString('en-GB')}
                angle={-45}
                textAnchor="end"
                height={50}
              />
              <YAxis label={{ value: 'Value (Rs)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `Rs ${value.toFixed(2)}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#198754"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="table-section">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Opening Stock</th>
              <th>Purchased</th>
              <th>Sold</th>
              <th>Closing Stock</th>
              <th>Unit Price (Rs)</th>
              <th>Total Value (Rs)</th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((item, i) => {
              const total = (item.quantity || 0) * (item.sellingPrice || 0);
              return (
                <tr key={item._id}>
                  <td>{i + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.itemCode}</td>
                  <td>{getCategoryName(item.category)}</td>
                  <td>{item.openingStock || 0}</td>
                  <td>{item.purchases || 0}</td>
                  <td>{item.sales || 0}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{(item.sellingPrice || 0).toFixed(2)}</td>
                  <td>{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <footer className="report-footer">
        <p><strong>Total Inventory Value: Rs {totalValue.toFixed(2)}</strong></p>
        <CSVLink className="csv-button" data={generateCSVData()} filename="inventory-report.csv">
          Export to CSV
        </CSVLink>
      </footer>
    </div>
  );
};

export default InventorySummary;
