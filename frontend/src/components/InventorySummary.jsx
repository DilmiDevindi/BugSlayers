import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  ResponsiveContainer
} from 'recharts';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = ["#0d6efd", "#198754", "#dc3545", "#ffc107", "#6f42c1", "#fd7e14"];

const InventorySummary = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stockTrends, setStockTrends] = useState([]);

  useEffect(() => {
    fetchInventoryItems();
    fetchCategories();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [inventoryItems]);

  const fetchInventoryItems = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/inventory');
      const data = await res.json();
      setInventoryItems(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/category');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getCategoryName = (id) => {
    const cat = categories.find(c => c._id === id);
    return cat ? cat.categoryName : 'Unknown';
  };

  const applyFilters = () => {
    const items = [...inventoryItems];
    setFilteredItems(items);

    // Pie Data
    const pieMap = {};
    items.forEach(i => {
      pieMap[i.category] = (pieMap[i.category] || 0) + i.quantity;
    });
    setPieData(Object.entries(pieMap).map(([id, val]) => ({
      category: getCategoryName(id),
      value: val,
    })));

    // Bar Data (Top 3)
    setBarData(items.sort((a, b) => b.quantity - a.quantity).slice(0, 3).map(i => ({
      itemName: i.name,
      quantity: i.quantity
    })));

    // Line Chart Data
    setStockTrends(items.map(i => ({
      date: i.dateAdded,
      value: i.quantity * i.price || 0
    })));
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Inventory Summary Report", 14, 15);

    const tableColumn = [
      "#", "Product Name", "Opening Stock", "Opening Stock Value (Rs)",
      "No. of Purchases", "Value of Purchases (Rs)",
      "No. of Sales", "Value of Sales (Rs)",
      "Closing Stock", "Closing Stock Value (Rs)",
      "Profit (Rs)"
    ];

    const tableRows = filteredItems.map((item, i) => {
      const os = item.openingStock || 0;
      const ov = os * item.price;
      const p = item.purchases || 0;
      const pv = p * item.price;
      const s = item.sales || 0;
      const sv = s * item.price;
      const cs = item.quantity || 0;
      const cv = cs * item.price;
      const profit = sv - pv;
      return [
        i + 1,
        item.name,
        os,
        ov.toFixed(2),
        p,
        pv.toFixed(2),
        s,
        sv.toFixed(2),
        cs,
        cv.toFixed(2),
        profit.toFixed(2)
      ];
    });

    doc.autoTable({
      startY: 20,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [13, 110, 253] },
      alternateRowStyles: { fillColor: [240, 240, 240] }
    });

    doc.save("inventory-summary.pdf");
  };

  const generateCSVData = () => {
    const headers = [
      "No", "Product Name", "Opening Stock", "Opening Stock Value (Rs)",
      "No. of Purchases", "Value of Purchases (Rs)",
      "No. of Sales", "Value of Sales (Rs)",
      "Closing Stock", "Closing Stock Value (Rs)",
      "Profit (Rs)"
    ];
    const rows = filteredItems.map((item, i) => {
      const os = item.openingStock || 0;
      const ov = os * item.price;
      const p = item.purchases || 0;
      const pv = p * item.price;
      const s = item.sales || 0;
      const sv = s * item.price;
      const cs = item.quantity || 0;
      const cv = cs * item.price;
      const profit = sv - pv;
      return [
        i + 1, item.name, os, ov.toFixed(2), p, pv.toFixed(2),
        s, sv.toFixed(2), cs, cv.toFixed(2), profit.toFixed(2)
      ];
    });
    return [headers, ...rows];
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="#000" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
        {`${pieData[index].category}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalInventoryValue = filteredItems.reduce(
    (acc, item) => acc + (item.quantity * item.price || 0), 0
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h4 className="fw-bold text-primary">Inventory Summary Report</h4>
        <h6><b>A comprehensive overview of your current inventory, categorized by stock, sales trends, and more.</b></h6>
      </div>

      <div className="row g-4 mb-4">
        {[
          { title: 'Total Inventory', value: filteredItems.length, class: 'success' },
          { title: 'Total Inventory Value', value: `Rs. ${totalInventoryValue.toFixed(2)}`, class: 'primary' },
          { title: 'Out of Stock', value: filteredItems.filter(i => i.quantity === 0).length, class: 'danger' },
          { title: 'Low Stock', value: filteredItems.filter(i => i.quantity < 5).length, class: 'warning' },
        ].map((card, i) => (
          <div key={i} className="col-lg-3 col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className={`card-title text-${card.class}`}>{card.title}</h5>
                <h6><b>{card.value}</b></h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      <br />
      <br />
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <h6>Stock Distribution by Category</h6>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80} labelLine={false} label={renderCustomizedLabel}>
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="col-md-6">
          <h6>Top Stocked Items</h6>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={340}>
              <BarChart data={barData} margin={{ top: 30, right: 30, left: 0, bottom: 30 }}>
                <XAxis dataKey="itemName" angle={-45} textAnchor="end" interval={0} height={70} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <br />
      <br />

      <div className="mb-4">
        <h6>Inventory Value Trend</h6>
        <div className="card shadow-sm p-3">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stockTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#198754" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
        <div className="d-flex gap-2">
          <button className="btn btn-danger" onClick={exportPDF}><i className="bi bi-file-pdf"></i> Export PDF</button>
          <CSVLink data={generateCSVData()} filename="inventory-summary.csv" className="btn btn-success">
            <i className="bi bi-file-earmark-spreadsheet"></i> Export CSV
          </CSVLink>
        </div>
      </div>
    </div>
  );
};

export default InventorySummary;
