const { Kafka } = require('kafkajs');
const { AppError } = require('../../shared/middleware/errorHandler');

const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});

const producer = kafka.producer();

// Connect to Kafka producer
async function connectProducer() {
  try {
    await producer.connect();
    console.log('✅ Kafka producer connected (Payment Service)');
  } catch (err) {
    console.error('❌ Failed to connect Kafka producer:', err);
    throw new AppError('Kafka connection failed in Payment Service', 500);
  }
}

// Connect on module load
connectProducer().catch((err) => {
  console.error('[Startup Kafka Error]', err.message);
});

async function sendEvent(topic, data) {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log(`📨 Sent Kafka event: ${topic}`);
  } catch (err) {
    console.error(`❌ Kafka send error on topic "${topic}"`, err);
    throw new AppError(`Failed to send Kafka message to topic "${topic}"`, 500);
  }
}

async function sendPaymentSuccessful(data) {
  return sendEvent('payment-successful', data);
}

async function sendPaymentFailed(data) {
  return sendEvent('payment-failed', data);
}

module.exports = {
  sendPaymentSuccessful,
  sendPaymentFailed,
};
