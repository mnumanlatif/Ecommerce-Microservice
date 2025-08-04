require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { errorMiddleware } = require('../shared/middleware/errorHandler');
const { connectConsumer } = require('./kafka/orderConsumer');

const paymentRoutes = require('./routes/paymentRoutes'); // ✅ Import route

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

// ✅ Add payment route
app.use('/api/pay', paymentRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Payment service running');
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
