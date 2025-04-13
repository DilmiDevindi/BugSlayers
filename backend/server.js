const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const supplierRoutes = require('./routes/supplierRoutes'); 
const inventoryRoutes = require('./routes/inventoryRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); 
const salesRoutes = require('./routes/salesRoutes'); // Import the sales route

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json()); // Ensure this middleware is present to parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/merninventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });


// Routes
app.use('/api/suppliers', supplierRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/customers', customerRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/sales', salesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
