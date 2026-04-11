const { gql } = require('graphql-tag');

const typeDefs = gql`
  type MatchRecommendation {
    userId: ID!
    score: Int!
    reason: String
    commonCourses: [String]
    commonTopics: [String]
    requestStatus: String
  }

  type BuddyRequest {
    id: ID!
    fromUser: ID!
    toUser: ID!
    status: String!
    createdAt: String!
  }

  type Connection {
    userId: ID!
  }

  type Query {
    getPotentialMatches: [MatchRecommendation!]!
    getBuddyRequests: [BuddyRequest!]! # requests received by current user
    getConnections: [Connection!]!     # users you are connected with
  }

  type Mutation {
    sendBuddyRequest(toUser: ID!): BuddyRequest!
    acceptBuddyRequest(requestId: ID!): BuddyRequest!
    rejectBuddyRequest(requestId: ID!): BuddyRequest!
  }
`;

module.exports = { typeDefs };
