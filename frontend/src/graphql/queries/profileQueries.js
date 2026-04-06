import { gql } from '@apollo/client';

export const GET_MY_FULL_PROFILE = gql`
  query GetMyFullProfile {
    me {
      id
      name
      email
      university
      major
      academicYear
      contactInfo
    }
    getMyProfile {
      id
      courses {
        id
        name
        code
      }
      topics {
        id
        name
      }
      preferences {
        id
        studyPace
        studyMode
        groupSize
        studyStyle
      }
    }
  }
`;
