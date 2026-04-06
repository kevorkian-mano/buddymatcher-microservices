const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    university: String
    major: String
    academicYear: String
    contactInfo: String
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    getUserById(id: ID!): User
  }

  type Mutation {
    register(
      name: String!
      email: String!
      password: String!
      university: String
      major: String
      academicYear: String
      contactInfo: String
    ): AuthPayload!

    login(email: String!, password: String!): AuthPayload!

    updateProfile(
      name: String
      university: String
      major: String
      academicYear: String
      contactInfo: String
    ): User!
  }
`;

module.exports = { typeDefs };
