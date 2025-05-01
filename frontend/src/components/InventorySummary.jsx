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

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold text-primary">Inventory Summary Report</h1>
        <p className="text-muted">A comprehensive overview of your current inventory, categorized by stock, sales trends, and more.</p>
      </div>

    {/* Summary Cards */}
    <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Inventory</h5>
              <p className="h4">{inventoryItems.length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info">Categories</h5>
              <p className="h4">{categories.length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">Out of Stock</h5>
              <p className="h4">{inventoryItems.filter(item => item.quantity === 0).length}</p>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Low Stock</h5>
              <p className="h4">{inventoryItems.filter(item => item.quantity < 5).length}</p>
            </div>
          </div>
        </div>
      </div>

      


