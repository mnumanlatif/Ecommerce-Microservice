const kafka = require('./kafkaClient');

const producer = kafka.producer();

async function connectProducer() {
  try {
    await producer.connect();
    console.log('Kafka producer connected');
  } catch (err) {
    console.error('Error connecting Kafka producer', err);
  }
}

// Send messages to a topic
async function sendMessage(topic, messages) {
  try {
    // messages: array of { key?, value }
    await producer.send({
      topic,
      messages,
    });
  } catch (err) {
    console.error(`Error sending message to topic ${topic}`, err);
  }
}

module.exports = {
  connectProducer,
  sendMessage,
  producer,
};
