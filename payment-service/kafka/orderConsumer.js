const { Kafka } = require('kafkajs');
const { processPayment } = require('../controllers/paymentController');
const { AppError } = require('../../shared/middleware/errorHandler');

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const consumer = kafka.consumer({ groupId: 'payment-group' });

async function connectConsumer() {
  try {
    await consumer.connect();
    console.log('✅ Kafka consumer connected (Payment Service)');

    await consumer.subscribe({ topic: 'order-created', fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const order = JSON.parse(message.value.toString());
          console.log('📥 Received order:', order);

          await processPayment(order);
        } catch (err) {
          console.error('❌ Error processing payment:', err);
          // Optionally rethrow as operational error
          if (!(err instanceof AppError)) {
            throw new AppError('Payment processing failed internally', 500);
          }
        }
      },
    });
  } catch (err) {
    console.error('❌ Kafka consumer error:', err.message);
    throw new AppError('Kafka consumer failed to initialize in Payment Service', 500);
  }
}

module.exports = { connectConsumer };
