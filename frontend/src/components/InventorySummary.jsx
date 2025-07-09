import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
} from 'recharts';
import './InventorySummary.css';

const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#9D4EDD', '#00B8A9'];

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

    const sortedLineData = lineTemp
      .filter((d) => d.date)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setLineData(sortedLineData);
  }, [inventoryItems, categories]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : 'Unknown';
  };

  const totalValue = inventoryItems.reduce(
    (sum, it) => sum + (it.quantity || 0) * (it.sellingPrice || 0),
    0
  );

  const totalItems = inventoryItems.length;
  const outOfStock = inventoryItems.filter(it => (it.quantity || 0) === 0).length;
  const lowStock = inventoryItems.filter(it => (it.quantity || 0) < 5 && (it.quantity || 0) > 0).length;

  const totalCategories = totalValue.toFixed(2);
  const totalOrders = outOfStock;
  const totalUsers = lowStock;

  const generateCSVData = () => {
    const headers = [
      'No', 'Product', 'Item Code', 'Category', 'Date', 'Supplier',
      'Quantity', 'Unit Price (Rs)', 'Total Value (Rs)',
    ];
    const rows = inventoryItems.map((item, i) => {
      const total = (item.quantity || 0) * (item.sellingPrice || 0);
      return [
        i + 1,
        item.productName || 'N/A',
        item.itemCode || 'N/A',
        getCategoryName(item.category),
        item.dateAdded || 'N/A',
        item.supplier || 'N/A',
        item.quantity || 0,
        (item.sellingPrice || 0).toFixed(2),
        total.toFixed(2),
      ];
    });
    return [headers, ...rows];
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor('#34495e');
    doc.text('Inventory Summary Reports', 14, 20);
    const tableColumn = [
      'No', 'Product', 'Item Code', 'Category', 'Date', 'Supplier',
      'Quantity', 'Unit Price (Rs)', 'Total Value (Rs)',
    ];
    const tableRows = inventoryItems.map((item, i) => {
      const total = (item.quantity || 0) * (item.sellingPrice || 0);
      return [
        i + 1,
        item.productName || 'N/A',
        item.itemCode || 'N/A',
        getCategoryName(item.category),
        item.dateAdded || 'N/A',
        item.supplier || 'N/A',
        item.quantity || 0,
        (item.sellingPrice || 0).toFixed(2),
        total.toFixed(2),
      ];
    });
    doc.autoTable({
      startY: 30,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8, textColor: '#222' },
      headStyles: { fillColor: [52, 73, 94] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
    doc.save('inventory-summary-report.pdf');
  };

  return (
    
    <div className="inventory-report-wrapper">
      {/* Company Details */}
      <header className="company-header">
        <h6 className="company-name"><b><center>New Sisira Furniture</center></b></h6>
        <h6 className="report-name"><b><center>Inventory Summary Report</center></b></h6>
      </header>
      <br />
      <br />
   

      {/* Summary Cards */}
      <section className="summary-cards">
        <div className="summary-card">
          <div className="card-label">Total Inventory Items</div>
          <div className="card-value">{totalItems}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Total Value (Rs)</div>
          <div className="card-value">{totalCategories}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Out of Stock</div>
          <div className="card-value">{totalOrders}</div>
        </div>
        <div className="summary-card">
          <div className="card-label">Low Stock</div>
          <div className="card-value">{totalUsers}</div>
        </div>
      </section>

      <br />
      {/* Charts */}
      <section className="charts-row" style={{ marginBottom: '1rem' }}>
        <div className="chart-row-top" style={{ display: 'flex', gap: '1rem' }}>
          <div className="chart-container" style={{ flex: 1 }}>
            <h7><b>Stock Distribution by Category</b></h7>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label={({ category, percent }) =>
                    `${category}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelStyle={{ fill: 'black' }}
                >
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} items`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-container" style={{ flex: 1 }}>
            <h7><b>Top 10 Stocked Items</b></h7>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                <XAxis dataKey="inventoryItem" angle={-45} textAnchor="end" height={60} />
                <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#34495e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <br />

        <div className="chart-row-bottom" style={{ marginTop: '1rem' }}>
          <div className="chart-container">
            <h7><b>Inventory Value Trends</b></h7>
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
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#27ae60"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <br />

      {/* Table */}
      <section className="table-section">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Product</th>
              <th>Item Code</th>
              <th>Category</th>
              <th>Date</th>
              <th>Supplier</th>
              <th>Quantity</th>
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
                  <td>{item.productName || 'N/A'}</td>
                  <td>{item.itemCode || 'N/A'}</td>
                  <td>{getCategoryName(item.category)}</td>
                  <td>{item.dateAdded || 'N/A'}</td>
                  <td>{item.supplier || 'N/A'}</td>
                  <td>{item.quantity || 0}</td>
                  <td>{(item.sellingPrice || 0).toFixed(2)}</td>
                  <td>{total.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Footer */}
      <footer className="report-footer">
        <button className="pdf-button" onClick={generatePDF}>
          Generate PDF
        </button>
        <CSVLink className="csv-button" data={generateCSVData()} filename="inventory-report.csv">
          Export to CSV
        </CSVLink>
      </footer>
    </div>
  );
};

export default InventorySummary;
