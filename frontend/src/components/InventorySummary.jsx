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

const COLORS = ['#34495e', '#27ae60', '#c0392b', '#f39c12', '#8e44ad', '#d35400'];

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
