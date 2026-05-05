const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const kafka = new Kafka({
  clientId: 'matching-service-consumer',
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

        const courseIds  = courses  ? courses.map(c => c.name || c.id || c) : [];
        const topicNames = topics   ? topics.map(t => t.name || t.id || t) : [];

        const updateData = { courses: courseIds, topics: topicNames };
        const createData = { userId, courses: courseIds, topics: topicNames };

        if (preferences) {
          if (preferences.studyPace  !== undefined) { updateData.studyPace  = preferences.studyPace;  createData.studyPace  = preferences.studyPace; }
          if (preferences.studyMode  !== undefined) { updateData.studyMode  = preferences.studyMode;  createData.studyMode  = preferences.studyMode; }
          if (preferences.studyStyle !== undefined) { updateData.studyStyle = preferences.studyStyle; createData.studyStyle = preferences.studyStyle; }
        }

        await prisma.matchCandidate.upsert({
          where: { userId },
          update: updateData,
          create: createData
        });
        console.log(`[Matching] Updated candidate profile for user ${userId} — courses: ${courseIds.length}, topics: ${topicNames.length}`);
      }

      if (topic === 'AvailabilityUpdated') {
        const { userId, slots } = payload;
        await prisma.matchCandidate.upsert({
          where: { userId },
          update: { availability: slots },
          create: {
            userId,
            courses:      [],
            topics:       [],
            availability: slots
          }
        });
        console.log(`[Matching] Updated availability for user ${userId} — ${slots?.length ?? 0} slot(s)`);
      }
    },
  });
}

module.exports = { startConsumer };
