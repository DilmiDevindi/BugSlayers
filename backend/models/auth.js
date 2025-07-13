// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();          // ⬅️ loads .env
const router = express.Router();

// --- Login (only one admin) ---------------------------------
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // credentials stored in .env
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  // simple check (no DB needed)
  if (email === adminEmail && password === adminPassword) {
    // create a JWT valid for 1 hour
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    return res.json({ success: true, token, message: 'Login successful' });
  }

  return res.json({ success: false, message: 'Invalid admin credentials' });
});

// --- Middleware to protect routes ----------------------------
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); // decode & attach
    next();                                               // go to controller
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// export both router *and* the middleware
module.exports = { authRouter: router, verifyToken };

