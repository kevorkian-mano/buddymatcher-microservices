const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
const kafka = new Kafka({
  clientId: 'session-service',
  brokers: [process.env.KAFKA_BROKER],
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: process.env.KAFKA_API_KEY,
    password: process.env.KAFKA_API_SECRET,
  },
});
console.log('KAFKA_BROKER:', process.env.KAFKA_BROKER);
console.log('KAFKA_API_KEY:', process.env.KAFKA_API_KEY ? 'SET' : 'NOT SET');
console.log('KAFKA_API_SECRET:', process.env.KAFKA_API_SECRET ? 'SET' : 'NOT SET');

const producer = kafka.producer();

let connected = false;

async function publishEvent(eventName, payload) {
  if (!connected) { await producer.connect(); connected = true; }
  const message = {
    event: eventName,
    timestamp: new Date().toISOString(),
    producer: 'session-service',
    correlationId: uuidv4(),
    payload
  };
  await producer.send({ topic: eventName, messages: [{ value: JSON.stringify(message) }] });
  console.log(`[Kafka] Published: ${eventName}`);
}

module.exports = { publishEvent };
