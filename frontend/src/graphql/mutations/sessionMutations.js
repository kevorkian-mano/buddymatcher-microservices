import { gql } from '@apollo/client';

export const CREATE_SESSION = gql`
  mutation CreateSession(
    $topic: String!
    $startTime: String!
    $duration: Int!
    $sessionType: String!
    $location: String
    $contactInfo: String
    $invitedUserIds: [ID!]
  ) {
    createSession(
      topic: $topic
      startTime: $startTime
      duration: $duration
      sessionType: $sessionType
      location: $location
      contactInfo: $contactInfo
      invitedUserIds: $invitedUserIds
    ) {
      id
      topic
      startTime
      creatorContactInfo
    }
  }
`;

export const UPDATE_SESSION = gql`
  mutation UpdateSession(
    $sessionId: ID!
    $topic: String
    $startTime: String
    $duration: Int
    $sessionType: String
    $location: String
    $contactInfo: String
  ) {
    updateSession(
      sessionId: $sessionId
      topic: $topic
      startTime: $startTime
      duration: $duration
      sessionType: $sessionType
      location: $location
      contactInfo: $contactInfo
    ) {
      id
      topic
      startTime
      duration
      sessionType
      location
      creatorContactInfo
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

export const TERMINATE_SESSION = gql`
  mutation TerminateSession($sessionId: ID!, $status: String!) {
    updateSession(sessionId: $sessionId, status: $status) {
      id
      status
    }
  }
`;
