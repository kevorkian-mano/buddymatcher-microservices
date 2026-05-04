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
      studyGoals {
        id
        goal
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

export const GET_PROFILE_BY_USER_ID = gql`
  query GetProfile($userId: ID!) {
    getUserById(id: $userId) {
      id
      name
      major
      academicYear
    }
    getProfileByUserId(userId: $userId) {
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
        studyPace
        studyStyle
      }
    }
    getAvailabilityByUserId(userId: $userId) {
      id
      dayOfWeek
      startTime
      endTime
    }
  }
`;
