const { gql } = require('graphql-tag');

const typeDefs = gql`
  type SessionParticipant {
    userId: ID!
    status: String
  }

  type StudySession {
    id: ID!
    creatorId: ID!
    topic: String!
    startTime: String!
    duration: Int!
    sessionType: String!
    location: String
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
    ): StudySession!

    joinSession(sessionId: ID!): StudySession!
    leaveSession(sessionId: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
