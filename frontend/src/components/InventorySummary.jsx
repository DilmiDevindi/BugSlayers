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

  

