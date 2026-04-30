const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Notification {
    id: ID!
    userId: ID!
    type: String!
    content: String!
    metadata: String
    read: Boolean!
    createdAt: String!
  }

  type Query {
    getMyNotifications: [Notification!]!
  }

  type Mutation {
    markNotificationRead(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
