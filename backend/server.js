const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Route imports
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const reportRoutes = require('./routes/reportRoutes');
const purchaseRoutes = require('./routes/purchasesRoutes');
const purchasereportRoutes = require('./routes/purchasereportRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern-vite-app';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

// Static file serving (e.g., for image uploads)
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// API Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes); // LOGIN ROUTES
app.use('/api/category', categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/purchase', purchaseRoutes);
app.use('/api/purchase-report', purchasereportRoutes);
app.use('/api/orders', orderRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// MongoDB connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => {
  console.error(' MongoDB connection error:', err);
  process.exit(1);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
