const mongoose = require('mongoose');
const app = require('./app');
const { connectConsumer } = require('./kafka/orderConsumer');

const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-payment';

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected (Payment Service)');

    try {
      await connectConsumer();
      console.log('Kafka consumer connected (Payment Service)');
    } catch (err) {
      console.error('Kafka consumer connection error:', err);
      process.exit(1); // Exit if Kafka connection fails
    }

    app.listen(PORT, () => {
      console.log(`Payment service running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error (Payment Service):', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Optional: Global error handling for unexpected crashes
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
