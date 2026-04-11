import { gql } from '@apollo/client';

export const SEND_BUDDY_REQUEST = gql`
  mutation SendBuddyRequest($toUser: ID!) {
    sendBuddyRequest(toUser: $toUser) {
      id
      status
    }
  }
`;

export const ACCEPT_BUDDY_REQUEST = gql`
  mutation AcceptBuddyRequest($requestId: ID!) {
    acceptBuddyRequest(requestId: $requestId) {
      id
      status
    }
  }
`;

export const REJECT_BUDDY_REQUEST = gql`
  mutation RejectBuddyRequest($requestId: ID!) {
    rejectBuddyRequest(requestId: $requestId) {
      id
      status
    }
  }
`;
