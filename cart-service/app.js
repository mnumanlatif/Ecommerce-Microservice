require('dotenv').config();
const express = require('express');
const cartRoutes = require('./routes/cartRoutes');
const { errorMiddleware } = require('../shared/middleware/errorHandler');
const cors = require('cors');
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Cart service running');
});

app.use(errorMiddleware);

module.exports = app;
