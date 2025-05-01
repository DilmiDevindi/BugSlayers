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