const { Kafka } = require('kafkajs');
const { AppError } = require('../../shared/middleware/errorHandler');

const kafka = new Kafka({
  clientId: 'cart-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

async function connectProducer() {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (err) {
    console.error('Kafka connection failed:', err);
    throw new AppError('Failed to connect to Kafka', 500);
  }
}

connectProducer().catch(console.error);

async function sendOrderCreated(order) {
  try {
    await producer.send({
      topic: 'order-created',
      messages: [
        { value: JSON.stringify(order) },
      ],
    });
    console.log('Order created event sent to Kafka');
  } catch (err) {
    console.error('Error sending order-created event:', err);
    throw new AppError('Failed to send order-created event', 500);
  }
}

module.exports = { sendOrderCreated };
