import { gql } from '@apollo/client';

export const GET_MY_AVAILABILITY = gql`
  query GetMyAvailability {
    getMyAvailability {
      id
      dayOfWeek
      startTime
      endTime
    }
  }
`;
