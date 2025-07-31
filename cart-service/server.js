const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-cart';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected (Cart Service)');
  app.listen(PORT, () => {
    console.log(`Cart service running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection error (Cart Service):', err);
});
