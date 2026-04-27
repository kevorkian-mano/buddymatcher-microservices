const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

function calculateScore(me, candidate) {
  let score = 0;
  const commonCourses = me.courses.filter(c => candidate.courses.includes(c));
  const commonTopics = me.topics.filter(t => candidate.topics.includes(t));
  
  // Scaled down weights
  score += commonCourses.length * 12;
  score += commonTopics.length * 8;
  
  if (me.studyMode && candidate.studyMode && me.studyMode === candidate.studyMode) score += 7;
  if (me.studyPace && candidate.studyPace && me.studyPace === candidate.studyPace) score += 7;
  if (me.studyStyle && candidate.studyStyle && me.studyStyle === candidate.studyStyle) score += 7;

  // Simple availability overlap check (if availability exists)
  if (me.availability && candidate.availability && Array.isArray(me.availability) && Array.isArray(candidate.availability)) {
     const myDays = me.availability.map(s => s.dayOfWeek);
     const theirDays = candidate.availability.map(s => s.dayOfWeek);
     const overlap = myDays.filter(d => theirDays.includes(d));
     if (overlap.length > 0) score += 10;
  }

  return { 
    score: Math.round(Math.min(score, 100)), // Cap at 100 and round nearest integer
    commonCourses,
    commonTopics
  }; 
}

const resolvers = {
  Query: {
    getPotentialMatches: async (_, __, { user }) => {
        // Ensure user is authenticated
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      // Fetch my profile
      const myProfile = await prisma.matchCandidate.findUnique({ where: { userId: user.id } });
      if (!myProfile) {
        // user hasn't set up profile yet
        return [];
      }

      // Fetch existing connections and pending requests to map status
      const existingReqs = await prisma.buddyRequest.findMany({
        where: {
          OR: [
            { fromUser: user.id },
            { toUser: user.id }
          ]
        }
      });
      
      const existingReqsMap = new Map();
      existingReqs.forEach(req => {
        const otherUser = req.fromUser === user.id ? req.toUser : req.fromUser;
        existingReqsMap.set(otherUser, req.status);
      });

      // Filter out ACCEPTED connections and users who sent us a request
      const excludedUserIds = [user.id];
      existingReqsMap.forEach((status, userId) => {
        if (status === 'ACCEPTED') {
          excludedUserIds.push(userId);
        } else {
          // If there's a PENDING request, we include them if WE sent it (so we can show it's "Requested")
          // BUT wait, what if they sent us a request? Maybe we exclude them so they show in "Requests" tab, not here.
          // Let's exclude if they sent us a request, or do whatever:
          // The issue says: "when i send a request... it must be kept gray with Requested" -> meaning we show them.
          // Let's just keep everyone else, and the frontend will look at the `requestStatus` field.
        }
      });
      // Actually, if we received a request, we might want to exclude them from suggestions as they appear in Buddy Requests tab.
      // We can iterate again and specifically exclude them
      existingReqs.forEach(req => {
        if (req.toUser === user.id && req.status === 'PENDING') {
          excludedUserIds.push(req.fromUser);
        }
      });

      // Fetch other candidates
      // In a real app, we would want to paginate this and not fetch all candidates at once
      const candidates = await prisma.matchCandidate.findMany({
        where: { userId: { notIn: excludedUserIds } }
      });

      // Calculate scores for each candidate
      const results = candidates.map(candidate => {
        const { score, commonCourses, commonTopics } = calculateScore(myProfile, candidate);
        let status = null;
        if (existingReqsMap.has(candidate.userId)) {
           status = existingReqsMap.get(candidate.userId); //e.g. 'PENDING'
        }
        return {
          userId: candidate.userId,
          score,
          commonCourses,
          commonTopics,
          reason: `Matched on ${commonCourses.length} courses and ${commonTopics.length} topics.`,
          requestStatus: status
        };
      });

      // Filter 0 scores and sort desc
      const sorted = results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

      // Removed publishEvent from here, as Queries should be side-effect free and not spam notifications.
      
      return sorted;
    },
    
    getBuddyRequests: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      return prisma.buddyRequest.findMany({
        where: { toUser: user.id, status: 'PENDING' }
      });
    },

    getConnections: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      const approved1 = await prisma.buddyRequest.findMany({
        where: { toUser: user.id, status: 'ACCEPTED' },
        select: { fromUser: true }
      });
      const approved2 = await prisma.buddyRequest.findMany({
        where: { fromUser: user.id, status: 'ACCEPTED' },
        select: { toUser: true }
      });
      
      const set = new Set();
      approved1.forEach(req => set.add(req.fromUser));
      approved2.forEach(req => set.add(req.toUser));
      
      return Array.from(set).map(userId => ({ userId }));
    }
  },

  Mutation: {
    sendBuddyRequest: async (_, { toUser }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      if (user.id === toUser) throw new GraphQLError('Cannot request yourself');

      // Check existing connection or request
      const existing = await prisma.buddyRequest.findFirst({
        where: {
          OR: [
            { fromUser: user.id, toUser: toUser },
            { fromUser: toUser, toUser: user.id }
          ]
        }
      });

      if (existing) {
        if (existing.status === 'PENDING') throw new GraphQLError('Request already pending');
        if (existing.status === 'ACCEPTED') throw new GraphQLError('Already connected');
        // If rejected, could allow re-request or not. Let's just update to pending.
        const updated = await prisma.buddyRequest.update({
          where: { id: existing.id },
          data: { status: 'PENDING', fromUser: user.id, toUser: toUser }
        });
        publishEvent('BuddyRequestCreated', { fromUser: user.id, toUser });
        return updated;
      }

      const req = await prisma.buddyRequest.create({
        data: { fromUser: user.id, toUser }
      });

      publishEvent('BuddyRequestCreated', { fromUser: user.id, toUser });
      return req;
    },

    acceptBuddyRequest: async (_, { requestId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      const req = await prisma.buddyRequest.findUnique({ where: { id: requestId } });
      if (!req) throw new GraphQLError('Request not found');
      if (req.toUser !== user.id) throw new GraphQLError('Unauthorized');

      return prisma.buddyRequest.update({
        where: { id: requestId },
        data: { status: 'ACCEPTED' }
      });
    },

    rejectBuddyRequest: async (_, { requestId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      const req = await prisma.buddyRequest.findUnique({ where: { id: requestId } });
      if (!req) throw new GraphQLError('Request not found');
      if (req.toUser !== user.id) throw new GraphQLError('Unauthorized');

      return prisma.buddyRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
      });
    }
  }
};

module.exports = { resolvers };
