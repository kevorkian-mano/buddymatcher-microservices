import { gql } from '@apollo/client';

export const REGISTER_USER = gql`
  mutation Register($name: String!, $email: String!, $password: String!, $contactInfo: String, $birthdate: String) {
    register(name: $name, email: $email, password: $password, contactInfo: $contactInfo, birthdate: $birthdate) {
      token
      user {
        id
        name
        email
        birthdate
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

export const LOGIN_USER = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;