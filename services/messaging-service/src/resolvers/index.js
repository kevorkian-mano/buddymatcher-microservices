const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getMessages: async (_, { conversationId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      // In real app, check if user is participant of conversation
      return prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' }
      });
    }
  },
  Mutation: {
    sendMessage: async (_, { conversationId, content }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated');
      
      return prisma.message.create({
        data: {
          senderId: user.id,
          conversationId,
          content
        }
      });
    }
  }
};

module.exports = { resolvers };
