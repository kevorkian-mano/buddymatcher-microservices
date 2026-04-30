import { gql } from '@apollo/client';

export const GET_MY_NOTIFICATIONS = gql`
  query GetMyNotifications {
    getMyNotifications {
      id
      type
      content
      metadata
      read
      createdAt
    }
  }
`;
