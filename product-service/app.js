require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');
const { errorMiddleware } = require('../shared/middleware/errorHandler');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Product Service DB Connected'))
  .catch(err => console.error('MongoDB error:', err));

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('Product Service is running');
});

app.use(errorMiddleware);

module.exports = app;
