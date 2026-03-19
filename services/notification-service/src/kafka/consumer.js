const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const kafka = new Kafka({ clientId: 'notification-service', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'notification-group' });

async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({ 
    topics: ['MatchFound', 'StudySessionCreated', 'StudySessionJoined', 'BuddyRequestCreated'], 
    fromBeginning: false 
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { payload } = event;
      console.log(`[Notification] Received ${topic}`, payload);

      if (topic === 'MatchFound') {
        const { toUser, score } = payload;
        await prisma.notification.create({
          data: {
            userId: toUser,
            type: 'MATCH_FOUND',
            content: `We found a new study buddy with ${score}% compatibility!`
          }
        });
      }

      if (topic === 'StudySessionCreated') {
         // Logic to notify relevant users (e.g., friends or matched buddies)
         // For now, logging, or maybe notify the creator
         console.log('Session Created, logic pending for who to notify.');
      }
      
      // Additional logic for other events
    },
  });
}

module.exports = { startConsumer };
