const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Message {
    id: ID!
    senderId: ID!
    conversationId: ID!
    content: String!
    createdAt: String!
  }

  type Query {
    getMessages(conversationId: ID!): [Message!]!
  }

  type Mutation {
    sendMessage(conversationId: ID!, content: String!): Message!
  }
`;

module.exports = { typeDefs };
