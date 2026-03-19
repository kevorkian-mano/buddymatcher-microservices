const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

function calculateScore(me, candidate) {
  let score = 0;
  const commonCourses = me.courses.filter(c => candidate.courses.includes(c));
  const commonTopics = me.topics.filter(t => candidate.topics.includes(t));
  
  // Weights
  score += commonCourses.length * 20;
  score += commonTopics.length * 15;
  
  if (me.studyMode && candidate.studyMode && me.studyMode === candidate.studyMode) score += 10;
  if (me.studyPace && candidate.studyPace && me.studyPace === candidate.studyPace) score += 10;
  if (me.studyStyle && candidate.studyStyle && me.studyStyle === candidate.studyStyle) score += 10;

  // Simple availability overlap check (if availability exists)
  if (me.availability && candidate.availability && Array.isArray(me.availability) && Array.isArray(candidate.availability)) {
     // rudimentary check: if they have at least one matching day
     const myDays = me.availability.map(s => s.dayOfWeek);
     const theirDays = candidate.availability.map(s => s.dayOfWeek);
     const overlap = myDays.filter(d => theirDays.includes(d));
     if (overlap.length > 0) score += 15;
  }

  return { 
    score: Math.min(score, 100), // Cap at 100
    commonCourses,
    commonTopics
  }; 
}

const resolvers = {
  Query: {
    getPotentialMatches: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const myProfile = await prisma.matchCandidate.findUnique({ where: { userId: user.id } });
      if (!myProfile) {
        // user hasn't set up profile yet
        return [];
      }

      // Fetch other candidates
      const candidates = await prisma.matchCandidate.findMany({
        where: { userId: { not: user.id } }
      });

      const results = candidates.map(candidate => {
        const { score, commonCourses, commonTopics } = calculateScore(myProfile, candidate);
        return {
          userId: candidate.userId,
          score,
          commonCourses,
          commonTopics,
          reason: `Matched on ${commonCourses.length} courses and ${commonTopics.length} topics.`
        };
      });

      // Filter 0 scores and sort desc
      const sorted = results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score);

      if (sorted.length > 0) {
        // Optional: publish match found event for the top match if it's new
        publishEvent('MatchFound', { fromUser: user.id, toUser: sorted[0].userId, score: sorted[0].score });
      }

      return sorted;
    }
  }
};

module.exports = { resolvers };
