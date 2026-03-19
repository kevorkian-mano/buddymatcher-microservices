const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const kafka = new Kafka({ clientId: 'matching-service-consumer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'matching-group' });

async function startConsumer() {
  await consumer.connect();
  // Subscribe to relevant topics
  await consumer.subscribe({ topics: ['UserPreferencesUpdated', 'AvailabilityUpdated'], fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const event = JSON.parse(message.value.toString());
      const { payload } = event;
      console.log(`[Kafka] Received ${topic}`, payload);

      if (topic === 'UserPreferencesUpdated') {
        const { userId, courses, topics, preferences } = payload;
        
        // Flatten courses and topics for easier storage
        const courseIds = courses ? courses.map(c => c.name || c.id) : [];
        const topicNames = topics ? topics.map(t => t.name || t.id) : [];

        await prisma.matchCandidate.upsert({
          where: { userId },
          update: {
            courses: courseIds,
            topics: topicNames,
            studyPace: preferences?.studyPace,
            studyMode: preferences?.studyMode,
            studyStyle: preferences?.studyStyle,
          },
          create: {
            userId,
            courses: courseIds,
            topics: topicNames,
            studyPace: preferences?.studyPace,
            studyMode: preferences?.studyMode,
            studyStyle: preferences?.studyStyle,
          }
        });
        console.log(`[Matching] Updated candidate profile for user ${userId}`);
      }

      if (topic === 'AvailabilityUpdated') {
        const { userId, slots } = payload;
        await prisma.matchCandidate.upsert({
          where: { userId },
          update: { availability: slots },
          create: { 
            userId, 
            availability: slots 
        }
        });
        console.log(`[Matching] Updated availability for user ${userId}`);
      }
    },
  });
}

module.exports = { startConsumer };
