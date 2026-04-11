import { gql } from '@apollo/client';

export const GET_SESSIONS = gql`
  query GetSessions {
    getSessions {
      id
      creatorId
      topic
      startTime
      duration
      sessionType
      location
      creatorContactInfo
      participants {
        userId
        status
        contactInfo
      }
    }
  }
`;
