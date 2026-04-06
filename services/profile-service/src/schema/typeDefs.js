const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Course {
    id: ID!
    name: String!
    code: String
  }

  type Topic {
    id: ID!
    name: String!
  }

  type StudyGoal {
    id: ID!
    goal: String!
  }

  type Preferences {
    id: ID!
    studyPace: String
    studyMode: String
    groupSize: String
    studyStyle: String
  }

  type Profile {
    id: ID!
    userId: ID!
    courses: [Course!]!
    topics: [Topic!]!
    studyGoals: [StudyGoal!]!
    preferences: Preferences
    updatedAt: String!
  }

  type Query {
    getMyProfile: Profile
    getProfileByUserId(userId: ID!): Profile
  }

  type Mutation {
    upsertProfile(userId: ID!): Profile!

    addCourse(name: String!, code: String): Course!
    removeCourse(courseId: ID!): Boolean!

    addTopic(name: String!): Topic!
    removeTopic(topicId: ID!): Boolean!

    addStudyGoal(goal: String!): StudyGoal!
    removeStudyGoal(goalId: ID!): Boolean!

    updatePreferences(
      studyPace: String
      studyMode: String
      groupSize: String
      studyStyle: String
    ): Preferences!
  }
`;

module.exports = { typeDefs };
