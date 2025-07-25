const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// ✅ Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ MongoDB connection
const mongoURI = process.env.MONGODB_URI || '';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Import Routes
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const subcategoryRoutes = require('./routes/subcategory');
const reportRoutes = require('./routes/reportRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const purchasesRoutes = require('./routes/purchasesRoutes');
const purchaseReportRoutes = require('./routes/purchasereportRoutes');
const billRoutes = require('./routes/billRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const orderRoutes = require('./routes/OrderRoutes');
const productSalesRoutes = require('./routes/productSales');
const returnRoutes = require('./routes/returnRoutes');
const refundRoutes = require('./routes/refundRoutes');

// ✅ Use Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/subcategories', subcategoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/purchase', purchasesRoutes);
app.use('/api/purchase-report', purchaseReportRoutes);
app.use('/api/bill', billRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/returns', returnRoutes);
app.use('/api/refunds', refundRoutes);
app.use('/api/productsales', productSalesRoutes);

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
