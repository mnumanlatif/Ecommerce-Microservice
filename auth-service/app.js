require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { errorMiddleware } = require('../shared/middleware/errorHandler'); // ✅ Import it
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());
// ✅ CORS middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ✅ JSON parser
app.use(express.json());

// ✅ Routes
app.use('/api/auth', authRoutes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Auth Service is running');
});

// ✅ Central error handler (must come last)
app.use(errorMiddleware);

module.exports = app;
