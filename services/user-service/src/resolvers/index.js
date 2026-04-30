const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');
const { GraphQLError } = require('graphql');

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.user.findUnique({ where: { id: user.id } });
    },
    getUserById: async (_, { id }, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.user.findUnique({ where: { id } });
    },
    getAllUsers: async (_, __, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      return prisma.user.findMany();
    }
  },

  Mutation: {
    register: async (_, { name, email, password, university, major, academicYear, contactInfo, birthdate }) => {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) throw new GraphQLError('Email already in use', { extensions: { code: 'BAD_USER_INPUT' } });
      
      const passwordHash = await bcrypt.hash(password, 10);
      const parsedBirthdate = birthdate ? new Date(birthdate) : null;

      const newUser = await prisma.user.create({
        data: { name, email, passwordHash, university, major, academicYear, contactInfo, birthdate: parsedBirthdate }
      });      const token = signToken({ id: newUser.id, email: newUser.email });
      return { token, user: newUser };
    },

    login: async (_, { email, password }) => {
      const foundUser = await prisma.user.findUnique({ where: { email } });
      if (!foundUser) throw new GraphQLError('Invalid credentials', { extensions: { code: 'UNAUTHENTICATED' } });

      const valid = await bcrypt.compare(password, foundUser.passwordHash);
      if (!valid) throw new GraphQLError('Invalid credentials', { extensions: { code: 'UNAUTHENTICATED' } });

      const token = signToken({ id: foundUser.id, email: foundUser.email });
      return { token, user: foundUser };
    },

    updateProfile: async (_, args, { user }) => {
      if (!user) throw new GraphQLError('Not authenticated', { extensions: { code: 'UNAUTHENTICATED' } });
      
      const updateData = { ...args };
      if (updateData.birthdate) {
        updateData.birthdate = new Date(updateData.birthdate);
      }

      return prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
    }
  }
};

module.exports = { resolvers };
