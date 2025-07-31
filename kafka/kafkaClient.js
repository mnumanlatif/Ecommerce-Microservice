const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID || 'ecommerce-app',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

module.exports = kafka;
