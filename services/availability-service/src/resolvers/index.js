const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

// Helper: check for overlapping slot for same user/day
async function checkOverlap(userId, dayOfWeek, startTime, endTime, excludeId = null) {
  const slots = await prisma.availabilitySlot.findMany({ where: { userId, dayOfWeek } });
  const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const newStart = toMinutes(startTime);
  const newEnd = toMinutes(endTime);
  return slots.some(s => {
    if (excludeId && s.id === excludeId) return false;
    const sStart = toMinutes(s.startTime);
    const sEnd = toMinutes(s.endTime);
    return newStart < sEnd && newEnd > sStart;
  });
}

const resolvers = {
  Query: {
    getMyAvailability: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.availabilitySlot.findMany({ where: { userId: user.id } });
    },
    getAvailabilityByUserId: async (_, { userId }) => {
      return prisma.availabilitySlot.findMany({ where: { userId } });
    }
  },

  Mutation: {
    addAvailabilitySlot: async (_, { dayOfWeek, startTime, endTime }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const overlaps = await checkOverlap(user.id, dayOfWeek, startTime, endTime);
      if (overlaps) throw new GraphQLError('Overlapping availability slot exists');

      const slot = await prisma.availabilitySlot.create({
        data: { userId: user.id, dayOfWeek, startTime, endTime }
      });
      const slots = await prisma.availabilitySlot.findMany({ where: { userId: user.id } });
      await publishEvent('AvailabilityUpdated', { userId: user.id, slots });
      return slot;
    },

    updateAvailabilitySlot: async (_, { id, startTime, endTime }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const existing = await prisma.availabilitySlot.findUnique({ where: { id } });
      if (!existing || existing.userId !== user.id) throw new GraphQLError('Slot not found or unauthorized');

      const newStart = startTime || existing.startTime;
      const newEnd = endTime || existing.endTime;
      const overlaps = await checkOverlap(user.id, existing.dayOfWeek, newStart, newEnd, id);
      if (overlaps) throw new GraphQLError('Overlapping availability slot exists');

      const updated = await prisma.availabilitySlot.update({ where: { id }, data: { startTime: newStart, endTime: newEnd } });
      const slots = await prisma.availabilitySlot.findMany({ where: { userId: user.id } });
      await publishEvent('AvailabilityUpdated', { userId: user.id, slots });
      return updated;
    },

    deleteAvailabilitySlot: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const existing = await prisma.availabilitySlot.findUnique({ where: { id } });
      if (!existing || existing.userId !== user.id) throw new GraphQLError('Slot not found or unauthorized');
      await prisma.availabilitySlot.delete({ where: { id } });
      const slots = await prisma.availabilitySlot.findMany({ where: { userId: user.id } });
      await publishEvent('AvailabilityUpdated', { userId: user.id, slots });
      return true;
    }
  }
};

module.exports = { resolvers };
