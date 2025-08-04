const mongoose = require('mongoose');
const app = require('./app');
const { connectConsumer } = require('./kafka/orderConsumer');

const PORT = process.env.PORT || 7000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-payment';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected (Payment Service)');

    await connectConsumer();
    console.log('✅ Kafka consumer connected (Payment Service)');

    app.listen(PORT, () => {
      console.log(`🚀 Payment service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Startup Error (Payment Service):', err);
    process.exit(1);
  }
})();

// Global error handling
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
