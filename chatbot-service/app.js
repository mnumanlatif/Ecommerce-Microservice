const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const chatbotRoutes = require('./routes/chatbotRoutes');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/chatbot', chatbotRoutes);

module.exports = app;
