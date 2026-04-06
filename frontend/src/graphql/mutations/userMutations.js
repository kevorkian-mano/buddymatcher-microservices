import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $contactInfo: String) {
    register(name: $name, email: $email, password: $password, contactInfo: $contactInfo) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile($university: String, $major: String, $academicYear: String, $contactInfo: String) {
    updateProfile(university: $university, major: $major, academicYear: $academicYear, contactInfo: $contactInfo) {
      id
      university
      major
      academicYear
    }
  }
`;