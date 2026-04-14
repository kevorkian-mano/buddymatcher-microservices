import { gql } from '@apollo/client';

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    getSessions {
      id
      topic
      startTime
      status
      duration
      sessionType
      location
      creatorId
      participants {
        userId
      }
    }
    getPotentialMatches {
      userId
      score
      reason
      commonCourses
      commonTopics
    }
    getConnections {
      userId
    }
  }
`;
