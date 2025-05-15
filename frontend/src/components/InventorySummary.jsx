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

const COLORS = ['#0d6efd', '#198754', '#dc3545', '#ffc107', '#6f42c1', '#fd7e14'];

const InventorySummary = () => {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [stockTrends, setStockTrends] = useState([]);

  
  /* DATA FETCH  */
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

  
  /* DATA TRANSFORMATIONS */
  useEffect(() => {
    if (!inventoryItems.length) return;

    /* Flat list (no additional filters for now) */
    setFilteredItems(inventoryItems);

    /* Pie: stock distribution by category */
    const pieMap = {};
    inventoryItems.forEach((it) => {
      pieMap[it.category] = (pieMap[it.category] || 0) + (it.quantity || 0);
    });
    setPieData(
      Object.entries(pieMap).map(([id, val]) => ({
        category: getCategoryName(id),
        value: val
      }))
    );

    /* Bar: top‑N stocked products */
    const topN = inventoryItems
      .map((it) => ({
        inventoryItem: it.productName, // match XAxis dataKey
        quantity: it.quantity || 0
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10); // show up to 10
    setBarData(topN);

    /* Line: inventory value trend */
    setStockTrends(
      inventoryItems.map((it) => ({
        date: it.dateAdded, // assumes ISO date string
        value: (it.quantity || 0) * (it.sellingPrice || 0)
      }))
    );
  }, [inventoryItems, categories]);

  const getCategoryName = (id) => {
    const cat = categories.find((c) => c._id === id);
    return cat ? cat.categoryName : 'Unknown';
  };

  
  /* EXPORT HANDLERS */
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: 'landscape' });
    doc.text('Inventory Summary Report', 14, 15);

    const headers = [
      '#',
      'Product',
      'Opening Stock',
      'Opening Value (Rs)',
      'Purchases',
      'Purchase Value (Rs)',
      'Sales',
      'Sales Value (Rs)',
      'Closing Stock',
      'Closing Value (Rs)',
      'Profit (Rs)'
    ];

    const rows = filteredItems.map((it, i) => {
      const os = it.openingStock || 0;
      const p  = it.purchases || 0;
      const s  = it.sales || 0;
      const cs = it.quantity || 0;
      const price = it.sellingPrice || 0;

      const ov = os * price;
      const pv = p * price;
      const sv = s * price;
      const cv = cs * price;
      const profit = sv - pv;

      return [
        i + 1,
        it.productName,
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

    // @ts-ignore jspdf-autotable adds autoTable
    doc.autoTable({ head: [headers], body: rows, startY: 20, styles: { fontSize: 8 } });

    doc.save('inventory-summary.pdf');
  };

  const generateCSVData = () => {
    const headers = [
      'No',
      'Product',
      'Opening Stock',
      'Opening Value (Rs)',
      'Purchases',
      'Purchase Value (Rs)',
      'Sales',
      'Sales Value (Rs)',
      'Closing Stock',
      'Closing Value (Rs)',
      'Profit (Rs)'
    ];
    const rows = filteredItems.map((it, i) => {
      const os = it.openingStock || 0;
      const p  = it.purchases || 0;
      const s  = it.sales || 0;
      const cs = it.quantity || 0;
      const price = it.sellingPrice || 0;

      const ov = os * price;
      const pv = p * price;
      const sv = s * price;
      const cv = cs * price;
      const profit = sv - pv;

      return [
        i + 1,
        it.productName,
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
    return [headers, ...rows];
  };

  /* RENDERING */
  const renderPieLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fontSize={12}
        fill="#000"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${pieData[index].category}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const totalValue = filteredItems.reduce(
    (sum, it) => sum + (it.quantity || 0) * (it.sellingPrice || 0),
    0
  );

  return (
    <div className="container py-5">
      <div className="text-center mb-4">
        <h4 className="fw-bold text-primary">Inventory Summary Report</h4>
        <p className="mb-0">
          A quick snapshot of stock levels, value, and trends in your store.
        </p>
      </div>

      {/* KPI cards */}
      <div className="row g-4 mb-4">
        {[
          { title: 'Total Items',               value: filteredItems.length,                             color: 'success' },
          { title: 'Inventory Value',           value: `Rs ${totalValue.toFixed(2)}`,                     color: 'primary' },
          { title: 'Out of Stock',              value: filteredItems.filter((it) => !it.quantity).length, color: 'danger' },
          { title: 'Low (<5) Stock',            value: filteredItems.filter((it) => it.quantity < 5).length, color: 'warning' }
        ].map((c) => (
          <div key={c.title} className="col-lg-3 col-md-6">
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <h6 className={`text-${c.color}`}>{c.title}</h6>
                <h5 className="fw-bold">{c.value}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts  */}
      <div className="row g-4">
        {/* Pie  */}
        <div className="col-md-6">
          <h6>Stock Distribution by Category</h6>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  labelLine={false}
                  label={renderPieLabel}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar */}
        <div className="col-md-6">
          <h6>Top Stocked Items</h6>
          <div className="card shadow-sm p-3">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={barData} margin={{ top: 20, right: 30, bottom: 40, left: 0 }}>
                <XAxis
                  dataKey="inventoryItem"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#0d6efd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Line */}
      <div className="my-5">
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

      {/* Export buttons */}
      <div className="d-flex gap-3 flex-wrap">
        <button className="btn btn-danger" onClick={exportPDF}>
          <i className="bi bi-file-pdf" /> Export PDF
        </button>
        <CSVLink data={generateCSVData()} filename="inventory-summary.csv" className="btn btn-success">
          <i className="bi bi-file-earmark-spreadsheet" /> Export CSV
        </CSVLink>
      </div>
    </div>
  );
};

export default InventorySummary;
