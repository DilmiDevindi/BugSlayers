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

  return ()


}    
export default InventorySummary;
  