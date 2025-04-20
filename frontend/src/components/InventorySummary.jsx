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
    return (
      <div className="container p-4">
        <h2>📦 Inventory Summary</h2>
        {/* Summary table, stock value, category-wise breakdown, etc. */}
      </div>
    );
  };
  export default InventorySummary;
  