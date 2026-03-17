const { gql } = require('graphql-tag');

const typeDefs = gql`
  type AvailabilitySlot {
    id: ID!
    userId: ID!
    dayOfWeek: Int!     # 0=Sun, 1=Mon, ... 6=Sat
    startTime: String!  # HH:MM
    endTime: String!    # HH:MM
  }

  type Query {
    getMyAvailability: [AvailabilitySlot!]!
    getAvailabilityByUserId(userId: ID!): [AvailabilitySlot!]!
  }

  type Mutation {
    addAvailabilitySlot(dayOfWeek: Int!, startTime: String!, endTime: String!): AvailabilitySlot!
    updateAvailabilitySlot(id: ID!, startTime: String, endTime: String): AvailabilitySlot!
    deleteAvailabilitySlot(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
