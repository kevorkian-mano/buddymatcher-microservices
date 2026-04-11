import { gql } from '@apollo/client';

export const ADD_AVAILABILITY_SLOT = gql`
  mutation AddAvailabilitySlot($dayOfWeek: Int!, $startTime: String!, $endTime: String!) {
    addAvailabilitySlot(dayOfWeek: $dayOfWeek, startTime: $startTime, endTime: $endTime) {
      id
      dayOfWeek
      startTime
      endTime
    }
  }
`;

export const UPDATE_AVAILABILITY_SLOT = gql`
  mutation UpdateAvailabilitySlot($id: ID!, $startTime: String, $endTime: String) {
    updateAvailabilitySlot(id: $id, startTime: $startTime, endTime: $endTime) {
      id
      dayOfWeek
      startTime
      endTime
    }
  }
`;

export const DELETE_AVAILABILITY_SLOT = gql`
  mutation DeleteAvailabilitySlot($id: ID!) {
    deleteAvailabilitySlot(id: $id)
  }
`;
