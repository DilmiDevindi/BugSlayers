import { useState, useEffect } from 'react';
import axios from 'axios';
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

  const summaryCards = [
    {title: "Total Stock Items", value: 254, color: "primary", icon: "box-seam" },
    { title: "Low Stock", value: 12, color: "danger", icon: "exclamation-triangle" },
    { title: "Total Stock Value", value: "Rs. 1.3M", color: "success", icon: "currency-dollar" },
    { title: "Out of Stock", value: 5, color: "warning", icon: "x-circle" },
  ];

  const pieData = [
    { category: "Furniture", value: 120 },
    { category: "Cushions", value: 60 },
    { category: "Mattresses", value: 30 },
    { category: "Other", value: 44 },
  ];

  const colors = ["#0d6efd", "#198754", "#dc3545", "#ffc107"];

  const barData = [
    { itemName: "Chair", quantity: 50 },
    { itemName: "Bed", quantity: 30 },
    { itemName: "Sofa", quantity: 25 },
    { itemName: "Table", quantity: 40 },
  ];

  const stockTrends = [
    { date: "Apr 1", value: 200000 },
    { date: "Apr 5", value: 220000 },
    { date: "Apr 10", value: 230000 },
    { date: "Apr 15", value: 250000 },
  ];

  const inventoryItems = [
    { code: "FUR-102", name: "Study Table", category: "Furniture", quantity: 15, price: "Rs. 24,000", supplier: "Mahinda Mills", date: "2025-04-12", img: "/images/study-table.jpg" },
    { code: "CUS-301", name: "Cushion Red", category: "Cushions", quantity: 40, price: "Rs. 2,000", supplier: "SoftTex", date: "2025-04-10", img: "/images/cushion.jpg" },
  ];

  const toggleExpand = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 fw-bold">Inventory Summary Report</h2>
      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        {summaryCards.map((card, idx) => (
          <div className="col-md-3" key={idx}>
            <div className={`card text-white bg-${card.color} shadow-sm rounded-4`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h6>{card.title}</h6>
                  <h4>{card.value}</h4>
                </div>
                <i className={`bi bi-${card.icon} fs-2`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="d-flex justify-content-between mb-4 flex-wrap gap-2">
        <div className="input-group w-auto">
          <label className="input-group-text">Category</label>
          <select className="form-select">
            <option value="">All</option>
            <option value="furniture">Furniture</option>
            <option value="cushions">Cushions</option>
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
          <h6>Stock Distribution by Category</h6>
          <PieChart width={400} height={300}>
            <Pie data={pieData} dataKey="value" nameKey="category" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="col-md-6">
          <h6>Top Stocked Items</h6>
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
      
      <div className="mb-5">
        <h6>Stock Value Trends</h6>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockTrends}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#28a745" />
          </LineChart>
        </ResponsiveContainer>
      </div>


  )


}    
export default InventorySummary;
  