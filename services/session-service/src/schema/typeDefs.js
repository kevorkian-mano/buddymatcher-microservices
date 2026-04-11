const { gql } = require('graphql-tag');

const typeDefs = gql`
  type SessionParticipant {
    userId: ID!
    status: String
    contactInfo: String
  }

  type StudySession {
    id: ID!
    creatorId: ID!
    topic: String!
    startTime: String!
    duration: Int!
    sessionType: String!
    location: String
    creatorContactInfo: String
    participants: [SessionParticipant!]!
  }

  type Query {
    getSessions: [StudySession!]!
    getSessionById(id: ID!): StudySession
  }

  type Mutation {
    createSession(
      topic: String!
      startTime: String!
      duration: Int!
      sessionType: String!
      location: String
      contactInfo: String
    ): StudySession!

    updateSession(
      sessionId: ID!
      topic: String
      startTime: String
      duration: Int
      sessionType: String
      location: String
      contactInfo: String
    ): StudySession!

    cancelSession(sessionId: ID!): Boolean!

    joinSession(sessionId: ID!, contactInfo: String): StudySession!
    leaveSession(sessionId: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
