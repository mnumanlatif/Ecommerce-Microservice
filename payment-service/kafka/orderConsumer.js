const { Kafka } = require('kafkajs');
const { processPayment } = require('../controllers/paymentController');
const { AppError } = require('../../shared/middleware/errorHandler');

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const CLIENT_ID = 'payment-service';
const GROUP_ID = 'payment-group';
const TOPIC = 'order-created';

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: GROUP_ID });

async function connectConsumer() {
  try {
    await consumer.connect();
    console.log(`✅ Kafka consumer connected (${CLIENT_ID})`);

    await consumer.subscribe({ topic: TOPIC, fromBeginning: false });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const order = JSON.parse(message.value.toString());
          console.log(`📥 Received order from topic "${topic}":`, order);

          // Call payment processing logic
          await processPayment(order);
        } catch (err) {
          console.error('❌ Error processing payment:', err);

          // Wrap unexpected errors as AppError for consistency
          if (!(err instanceof AppError)) {
            // Optional: log here or handle retries, dead-letter, etc.
            throw new AppError('Payment processing failed internally', 500);
          }
        }
      },
    });
  } catch (err) {
    console.error(`❌ Kafka consumer error: ${err.message}`);
    throw new AppError('Kafka consumer failed to initialize in Payment Service', 500);
  }
}

/**
 * Gracefully disconnect Kafka consumer.
 * Useful for app shutdown.
 */
async function disconnectConsumer() {
  try {
    await consumer.disconnect();
    console.log(`📴 Kafka consumer disconnected (${CLIENT_ID})`);
  } catch (err) {
    console.error(`❌ Error disconnecting Kafka consumer:`, err);
  }
}

module.exports = { connectConsumer, disconnectConsumer };
