const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User'); 
require('dotenv').config();

const customerRoutes = require('./routes/customerRoutes');

const app = express();

const JWT_SECRET = 'your_jwt_secret_key';

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', customerRoutes);

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    return res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.post('/api/logout', (req, res) => {
  // Clear the token on the server-side (if using server-side sessions)
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

  

// Start Server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
