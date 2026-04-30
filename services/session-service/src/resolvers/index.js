const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getSessions: async () => {
      // Return all sessions
      return prisma.studySession.findMany({
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
    createSession: async (_, { topic, startTime, duration, sessionType, location, contactInfo, invitedUserIds }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const session = await prisma.studySession.create({
        data: {
          creatorId: user.id,
          topic,
          startTime: new Date(startTime),
          duration,
          sessionType,
          location,
          creatorContactInfo: contactInfo,
          participants: {
            create: { userId: user.id, contactInfo: contactInfo }
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

      if (invitedUserIds && invitedUserIds.length > 0) {
        invitedUserIds.forEach(invitedUserId => {
          publishEvent('SessionInvitationReceived', {
            sessionId: session.id,
            fromUser: user.id,
            toUser: invitedUserId,
            topic: session.topic
          });
        });
      }

      return session;
    },
    updateSession: async (_, { sessionId, topic, startTime, duration, sessionType, status, location, contactInfo }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
      if (!session) throw new GraphQLError('Session not found');
      if (session.creatorId !== user.id) throw new GraphQLError('You are not the creator of this session');

      const data = {};
      if (topic !== undefined) data.topic = topic;
      if (startTime !== undefined) data.startTime = new Date(startTime);
      if (duration !== undefined) data.duration = duration;
      if (sessionType !== undefined) data.sessionType = sessionType;
      if (status !== undefined) data.status = status;
      if (location !== undefined) data.location = location;
      if (contactInfo !== undefined) data.creatorContactInfo = contactInfo;

      const updatedSession = await prisma.studySession.update({
        where: { id: sessionId },
        data,
        include: { participants: true }
      });

      if (contactInfo !== undefined) {
        await prisma.sessionParticipant.update({
          where: { sessionId_userId: { sessionId, userId: user.id } },
          data: { contactInfo }
        });
      }

      publishEvent('StudySessionUpdated', { 
        sessionId,
        creatorId: user.id,
        topic: updatedSession.topic 
      });

      return updatedSession;
    },
    cancelSession: async (_, { sessionId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const session = await prisma.studySession.findUnique({ where: { id: sessionId } });
      if (!session) throw new GraphQLError('Session not found');
      if (session.creatorId !== user.id) throw new GraphQLError('You are not the creator of this session');

      await prisma.studySession.delete({ where: { id: sessionId } });

      publishEvent('StudySessionCancelled', { sessionId, creatorId: user.id });

      return true;
    },
    joinSession: async (_, { sessionId, contactInfo }, { user }) => {
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
            create: { userId: user.id, contactInfo: contactInfo }
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
