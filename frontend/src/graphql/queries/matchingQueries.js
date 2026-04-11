import { gql } from '@apollo/client';

export const GET_POTENTIAL_MATCHES = gql`
  query GetPotentialMatches {
    getPotentialMatches {
      userId
      score
      reason
      commonCourses
      commonTopics
      requestStatus
    }
  }
`;

export const GET_BUDDY_REQUESTS = gql`
  query GetBuddyRequests {
    getBuddyRequests {
      id
      fromUser
      toUser
      status
      createdAt
    }
  }
`;

export const GET_CONNECTIONS = gql`
  query GetConnections {
    getConnections {
      userId
    }
  }
`;
