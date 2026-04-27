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
      status
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

export const GET_SESSION_BY_ID = gql`
  query GetSessionById($id: ID!) {
    getSessionById(id: $id) {
      id
      creatorId
      topic
      startTime
      duration
      sessionType
      status
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
