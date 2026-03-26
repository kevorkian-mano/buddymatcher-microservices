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
        
        const updateData = {};
        const createData = { userId };
        
        if (courses !== undefined) {
          const courseIds = courses.map(c => c.name || c.id);
          updateData.courses = courseIds;
          createData.courses = courseIds;
        } else {
          createData.courses = [];
        }
        
        if (topics !== undefined) {
          const topicNames = topics.map(t => t.name || t.id);
          updateData.topics = topicNames;
          createData.topics = topicNames;
        } else {
          createData.topics = [];
        }

        if (preferences) {
          if (preferences.studyPace !== undefined) {
            updateData.studyPace = preferences.studyPace;
            createData.studyPace = preferences.studyPace;
          }
          if (preferences.studyMode !== undefined) {
            updateData.studyMode = preferences.studyMode;
            createData.studyMode = preferences.studyMode;
          }
          if (preferences.studyStyle !== undefined) {
            updateData.studyStyle = preferences.studyStyle;
            createData.studyStyle = preferences.studyStyle;
          }
        }

        await prisma.matchCandidate.upsert({
          where: { userId },
          update: updateData,
          create: createData
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
