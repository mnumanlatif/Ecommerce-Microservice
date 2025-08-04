const { Kafka } = require('kafkajs');
const { AppError } = require('../../shared/middleware/errorHandler');

const KAFKA_BROKER = process.env.KAFKA_BROKER || 'localhost:9092';
const CLIENT_ID = 'payment-service';

const PAYMENT_SUCCESS_TOPIC = 'payment-successful';
const PAYMENT_FAILED_TOPIC = 'payment-failed';

const kafka = new Kafka({
  clientId: CLIENT_ID,
  brokers: [KAFKA_BROKER],
});

const producer = kafka.producer();
let isConnected = false;

async function connectProducer() {
  if (isConnected) return;
  try {
    await producer.connect();
    isConnected = true;
    console.log(`[Kafka] ✅ Producer connected (${CLIENT_ID})`);
  } catch (err) {
    console.error('[Kafka] ❌ Connection failed:', err);
    throw new AppError('Kafka connection failed in Payment Service', 500);
  }
}

connectProducer().catch(err => {
  console.error(`[Kafka Startup Error] ${err.message}`);
});

async function sendEvent(topic, data) {
  if (!isConnected) await connectProducer();

  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(data) }],
    });
    console.log(`[Kafka] 📨 Sent event to topic: ${topic}`);
  } catch (err) {
    console.error(`[Kafka] ❌ Failed to send to topic "${topic}":`, err);
    throw new AppError(`Kafka message send failed for topic "${topic}"`, 500);
  }
}

const sendPaymentSuccessful = (data) => sendEvent(PAYMENT_SUCCESS_TOPIC, data);
const sendPaymentFailed = (data) => sendEvent(PAYMENT_FAILED_TOPIC, data);

const disconnectProducer = async () => {
  if (!isConnected) return;
  try {
    await producer.disconnect();
    isConnected = false;
    console.log(`[Kafka] 📴 Producer disconnected (${CLIENT_ID})`);
  } catch (err) {
    console.error('[Kafka] ❌ Disconnect error:', err);
  }
};

// Optional: Call on shutdown
// process.on('SIGINT', () => disconnectProducer().then(() => process.exit(0)));
// process.on('SIGTERM', () => disconnectProducer().then(() => process.exit(0)));

module.exports = {
  sendPaymentSuccessful,
  sendPaymentFailed,
  disconnectProducer,
};
