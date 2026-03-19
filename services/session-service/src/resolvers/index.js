const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getSessions: async () => {
      // Return future sessions
      return prisma.studySession.findMany({
        where: { startTime: { gte: new Date() } },
        include: { participants: true },
        orderBy: { startTime: 'asc' }
      });
    },
    getSessionById: async (_, { id }) => {
      return prisma.studySession.findUnique({
        where: { id },
        include: { participants: true }
      });
    }
  },
  Mutation: {
    createSession: async (_, { topic, startTime, duration, sessionType, location }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const session = await prisma.studySession.create({
        data: {
          creatorId: user.id,
          topic,
          startTime: new Date(startTime),
          duration,
          sessionType,
          location,
          participants: {
            create: { userId: user.id }
          }
        },
        include: { participants: true }
      });

      publishEvent('StudySessionCreated', { 
        sessionId: session.id, 
        creatorId: user.id, 
        topic,
        startTime: session.startTime 
      });

      return session;
    },
    joinSession: async (_, { sessionId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
      if (!session) throw new GraphQLError('Session not found');

      // Check if already participanting
      const existing = await prisma.sessionParticipant.findUnique({
        where: { sessionId_userId: { sessionId, userId: user.id } }
      });
      if (existing) throw new GraphQLError('Already joined');

      const updatedSession = await prisma.studySession.update({
        where: { id: sessionId },
        data: {
          participants: {
            create: { userId: user.id }
          }
        },
        include: { participants: true }
      });

      publishEvent('StudySessionJoined', { sessionId, userId: user.id });

      return updatedSession;
    },
    leaveSession: async (_, { sessionId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');

      await prisma.sessionParticipant.delete({
        where: { sessionId_userId: { sessionId, userId: user.id } }
      });
      
      return true;
    }
  }
};

module.exports = { resolvers };
