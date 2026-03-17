const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');

const kafka = new Kafka({ clientId: 'profile-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const producer = kafka.producer();

let connected = false;

async function publishEvent(eventName, payload) {
  if (!connected) {
    await producer.connect();
    connected = true;
  }
  const message = {
    event: eventName,
    timestamp: new Date().toISOString(),
    producer: 'profile-service',
    correlationId: uuidv4(),
    payload
  };
  await producer.send({
    topic: eventName,
    messages: [{ value: JSON.stringify(message) }]
  });
  console.log(`[Kafka] Published event: ${eventName}`);
}

module.exports = { publishEvent };
