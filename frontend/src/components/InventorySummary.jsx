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
}    
export default InventorySummary;
  