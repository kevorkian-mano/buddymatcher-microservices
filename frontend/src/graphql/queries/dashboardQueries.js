import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getSessions {
      id
      topic
      startTime
      duration
      sessionType
      location
    }
    getPotentialMatches {
      userId
      score
      reason
      commonCourses
      commonTopics
    }
  }
`;
