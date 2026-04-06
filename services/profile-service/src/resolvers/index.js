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
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
    },
    getProfileByUserId: async (_, { userId }) => {
      return prisma.profile.findUnique({
        where: { userId },
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
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
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
    },

    addCourse: async (_, { name, code }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');
      const course = await prisma.course.create({ data: { name, code, profileId: profile.id } });
      
      const updatedProfile = await prisma.profile.findUnique({
        where: { id: profile.id },
        include: { courses: true, topics: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        preferences: updatedProfile.preferences
      });
      return course;
    },

    removeCourse: async (_, { courseId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const courseToDelete = await prisma.course.findUnique({ where: { id: courseId } });
      if (!courseToDelete) throw new GraphQLError('Course not found');
      await prisma.course.delete({ where: { id: courseId } });

      const updatedProfile = await prisma.profile.findUnique({
        where: { id: courseToDelete.profileId },
        include: { courses: true, topics: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        preferences: updatedProfile.preferences
      });
      return true;
    },

    addTopic: async (_, { name }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');
      const topic = await prisma.topic.create({ data: { name, profileId: profile.id } });
      
      const updatedProfile = await prisma.profile.findUnique({
        where: { id: profile.id },
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        studyGoals: updatedProfile.studyGoals,
        preferences: updatedProfile.preferences
      });
      return topic;
    },

    removeTopic: async (_, { topicId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const topicToDelete = await prisma.topic.findUnique({ where: { id: topicId } });
      if (!topicToDelete) throw new GraphQLError('Topic not found');
      await prisma.topic.delete({ where: { id: topicId } });

      const updatedProfile = await prisma.profile.findUnique({
        where: { id: topicToDelete.profileId },
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        studyGoals: updatedProfile.studyGoals,
        preferences: updatedProfile.preferences
      });
      return true;
    },

    addStudyGoal: async (_, { goal }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      const profile = await prisma.profile.findUnique({ where: { userId: user.id } });
      if (!profile) throw new GraphQLError('Profile not found');
      const studyGoal = await prisma.studyGoal.create({ data: { goal, profileId: profile.id } });
      
      const updatedProfile = await prisma.profile.findUnique({
        where: { id: profile.id },
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        studyGoals: updatedProfile.studyGoals,
        preferences: updatedProfile.preferences
      });
      return studyGoal;
    },

    removeStudyGoal: async (_, { goalId }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });

      const goalToDelete = await prisma.studyGoal.findUnique({ where: { id: goalId } });
      if (!goalToDelete) throw new GraphQLError('StudyGoal not found');
      await prisma.studyGoal.delete({ where: { id: goalId } });

      const updatedProfile = await prisma.profile.findUnique({
        where: { id: goalToDelete.profileId },
        include: { courses: true, topics: true, studyGoals: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        studyGoals: updatedProfile.studyGoals,
        preferences: updatedProfile.preferences
      });
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

      const updatedProfile = await prisma.profile.findUnique({
        where: { id: profile.id },
        include: { courses: true, topics: true, preferences: true }
      });
      await publishEvent('UserPreferencesUpdated', { 
        userId: user.id, 
        courses: updatedProfile.courses,
        topics: updatedProfile.topics,
        preferences: updatedProfile.preferences
      });
      return prefs;
    }
  }
};

module.exports = { resolvers };
