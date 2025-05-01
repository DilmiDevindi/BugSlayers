const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path'); // <-- Needed for serving static files

// Route imports
const supplierRoutes = require('./routes/supplierRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const reportRoutes = require('./routes/reportRoutes');
const purchaseRoutes = require("./routes/purchasesRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // Still useful for parsing JSON requests
app.use(express.json()); // Extra safety

//images
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // <-- Allows frontend access to image URLs
app.use('/uploads', express.static('uploads'));


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern-vite-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/catalog', catalogRoutes); // Use the catalog routes
app.use('/api/reports', reportRoutes);
app.use('/api/purchase', purchaseRoutes); // Use the purchase routes


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


