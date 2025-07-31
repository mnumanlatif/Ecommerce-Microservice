require('dotenv').config();
const express = require('express');
const { errorMiddleware } = require('../shared/middleware/errorHandler');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Payment service running');
});

// Global error handler
app.use(errorMiddleware);

module.exports = app;
