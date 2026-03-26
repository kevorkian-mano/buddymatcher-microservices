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
        const { creatorId, topic: sessionTopic, startTime } = payload;
        await prisma.notification.create({
          data: {
            userId: creatorId,
            type: 'SESSION_CREATED',
            content: `Your study session on ${sessionTopic} is scheduled for ${new Date(startTime).toLocaleString()}.`
          }
        });
      }

      if (topic === 'StudySessionJoined') {
        const { sessionId, userId } = payload;
        await prisma.notification.create({
          data: {
            userId,
            type: 'SESSION_JOINED',
            content: `You have successfully joined the study session.`
          }
        });
      }

      if (topic === 'BuddyRequestCreated') {
        const { toUser, fromUser } = payload;
        if (toUser) {
          await prisma.notification.create({
            data: {
              userId: toUser,
              type: 'BUDDY_REQUEST',
              content: `You have received a new buddy request!`
            }
          });
        }
      }
    },
  });
}

module.exports = { startConsumer };
