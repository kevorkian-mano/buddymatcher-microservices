import { gql } from '@apollo/client';

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
    }
  }
`;

export const GET_FULL_USER_BY_ID = gql`
  query GetFullUserById($id: ID!) {
    getUserById(id: $id) {
      id
      name
      university
      major
      academicYear
    }
  }
`;
