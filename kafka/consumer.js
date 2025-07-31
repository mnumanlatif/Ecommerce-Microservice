const kafka = require('./kafkaClient');

async function createConsumer(groupId, topics, eachMessageHandler) {
  const consumer = kafka.consumer({ groupId });

  try {
    await consumer.connect();
    console.log(`Kafka consumer connected for group ${groupId}`);

    for (const topic of topics) {
      await consumer.subscribe({ topic, fromBeginning: false });
    }

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          await eachMessageHandler({ topic, partition, message });
        } catch (err) {
          console.error('Error in message handler:', err);
        }
      },
    });

    return consumer;
  } catch (err) {
    console.error('Error creating Kafka consumer', err);
    throw err;
  }
}

module.exports = {
  createConsumer,
};
