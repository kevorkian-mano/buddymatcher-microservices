const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getMyNotifications: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      });

      return notifications.map(n => ({
        ...n,
        metadata: n.metadata ? JSON.stringify(n.metadata) : null,
        createdAt: n.createdAt.getTime().toString()
      }));
    }
  },
  Mutation: {
    markNotificationRead: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      // Ensure ownership
      const notif = await prisma.notification.findUnique({ where: { id } });
      if (!notif || notif.userId !== user.id) throw new GraphQLError('Access denied');

      await prisma.notification.update({
        where: { id },
        data: { read: true }
      });
      return true;
    }
  }
};

module.exports = { resolvers };
