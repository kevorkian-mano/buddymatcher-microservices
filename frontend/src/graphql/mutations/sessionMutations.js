import { gql } from '@apollo/client';

export const CREATE_SESSION = gql`
  mutation CreateSession(
    $topic: String!
    $startTime: String!
    $duration: Int!
    $sessionType: String!
    $location: String
  ) {
    createSession(
      topic: $topic
      startTime: $startTime
      duration: $duration
      sessionType: $sessionType
      location: $location
    ) {
      id
      topic
      startTime
    }
  }
`;

export const JOIN_SESSION = gql`
  mutation JoinSession($sessionId: ID!) {
    joinSession(sessionId: $sessionId) {
      id
    }
  }
`;
