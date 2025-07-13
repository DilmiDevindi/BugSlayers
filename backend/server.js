
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config(); // Add this to load .env variables


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Import routes
app.use("/api/suppliers", require("./routes/supplierRoutes"));
app.use("/api/inventory", require("./routes/inventoryRoutes"));
app.use("/api/customers", require("./routes/customerRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/category", require("./routes/categoryRoutes"));
app.use("/api/subcategories", require("./routes/subcategory"));
app.use("/api/reports", require("./routes/reportRoutes"));
app.use("/api/sales", require("./routes/salesRoutes"));
app.use("/api/catalog", require("./routes/catalogRoutes"));
app.use("/api/purchase", require("./routes/purchasesRoutes"));
app.use("/api/purchase-report", require("./routes/purchasereportRoutes"));
app.use("/api/bill", require("./routes/billRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/orders", require("./routes/OrderRoutes"));
app.use("/api/returns", require("./routes/returnRoutes"));
app.use("/api/refunds", require("./routes/refundRoutes"));

// ✅ Import Routes
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategory');
const reportRoutes = require('./routes/reportRoutes');
const salesRoutes = require('./routes/salesRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');
const purchaseReportRoutes = require('./routes/purchasereportRoutes');
const billRoutes = require('./routes/billRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const productSalesRoutes = require('./routes/productSales'); // ✅ Order routes
const returnRoutes = require('./routes/returnRoutes'); // ✅ Added missing import

// ✅ Use Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/purchase', purchasesRoutes);
app.use('/api/purchase-report', purchaseReportRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/productsales', productSalesRoutes);

 
// ✅ MongoDB connection using your Atlas connection string from .env
const mongoURI = process.env.MONGODB_URI || '';

// Connect to MongoDB Atlas
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

app.use('/api/returns', returnRoutes); // ✅ Fixed ReferenceError


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);

});