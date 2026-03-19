const { gql } = require('graphql-tag');

const typeDefs = gql`
  type MatchRecommendation {
    userId: ID!
    score: Int!
    reason: String
    commonCourses: [String]
    commonTopics: [String]
  }

  type Query {
    getPotentialMatches: [MatchRecommendation!]!
  }
`;

module.exports = { typeDefs };
