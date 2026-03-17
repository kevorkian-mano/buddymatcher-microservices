const { PrismaClient } = require('@prisma/client');
const { GraphQLError } = require('graphql');
const { publishEvent } = require('../kafka/producer');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    getMyProfile: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.profile.findUnique({
        where: { userId: user.id },
        include: { courses: true, topics: true, preferences: true }
      });
    },
    getProfileByUserId: async (_, { userId }) => {
      return prisma.profile.findUnique({
        where: { userId },
        include: { courses: true, topics: true, preferences: true }
      });
    }
  },

  Mutation: {
    upsertProfile: async (_, { userId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.profile.upsert({
        where: { userId },
        update: {},
        create: { userId },
        include: { courses: true, topics: true, preferences: true }
      });
    },

    addCourse: async (_, { name, code }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');
      const course = await prisma.course.create({ data: { name, code, profileId: profile.id } });
      await publishEvent('UserPreferencesUpdated', { userId: user.id, type: 'course_added', courseId: course.id });
      return course;
    },

    removeCourse: async (_, { courseId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      await prisma.course.delete({ where: { id: courseId } });
      return true;
    },

    addTopic: async (_, { name }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');
      const topic = await prisma.topic.create({ data: { name, profileId: profile.id } });
      await publishEvent('UserPreferencesUpdated', { userId: user.id, type: 'topic_added', topicId: topic.id });
      return topic;
    },

    removeTopic: async (_, { topicId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      await prisma.topic.delete({ where: { id: topicId } });
      return true;
    },

    updatePreferences: async (_, args, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');

      const prefs = await prisma.preferences.upsert({
        where: { profileId: profile.id },
        update: args,
        create: { profileId: profile.id, ...args }
      });

      await publishEvent('UserPreferencesUpdated', { userId: user.id, type: 'preferences_updated', preferences: prefs });
      return prefs;
    }
  }
};

module.exports = { resolvers };
