# Profile Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Profile Service functionality via Apollo Studio or Postman.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

---

### 1. Upsert Profile

*Note: Often called automatically, but can be manually triggered to guarantee a profile exists.*

**Mutation:**
```graphql
mutation UpsertProfile {
  upsertProfile(userId: "<YOUR_USER_ID>") {
    id
    userId
    updatedAt
  }
}
```
**Expected Outcome:** Returns the initialized or updated profile object.

---

### 2. Add Course

**Mutation:**
```graphql
mutation AddCourse {
  addCourse(name: "Data Structures", code: "CS201") {
    id
    name
    code
  }
}
```
**Expected Outcome:** Adds a course to the user's profile and returns the Course.

---

### 3. Remove Course

**Mutation:**
```graphql
mutation RemoveCourse {
  removeCourse(courseId: "<COURSE_ID>")
}
```
**Expected Outcome:** Returns `true` if successful.

---

### 4. Add Topic

**Mutation:**
```graphql
mutation AddTopic {
  addTopic(name: "React.js") {
    id
    name
  }
}
```
**Expected Outcome:** Adds a topic and returns the Topic object.

---

### 5. Remove Topic

**Mutation:**
```graphql
mutation RemoveTopic {
  removeTopic(topicId: "<TOPIC_ID>")
}
```
**Expected Outcome:** Returns `true` if successful.

---

### 6. Add Study Goal

**Mutation:**
```graphql
mutation AddStudyGoal {
  addStudyGoal(goal: "Pass finals with A+") {
    id
    goal
  }
}
```
**Expected Outcome:** Returns the created StudyGoal.

---

### 7. Remove Study Goal

**Mutation:**
```graphql
mutation RemoveStudyGoal {
  removeStudyGoal(goalId: "<GOAL_ID>")
}
```
**Expected Outcome:** Returns `true` if successful.

---

### 8. Update Preferences

**Mutation:**
```graphql
mutation UpdatePreferences {
  updatePreferences(
    studyPace: "Moderate"
    studyMode: "Hybrid"
    groupSize: "Small Group"
    studyStyle: "Visual"
  ) {
    id
    studyPace
    studyMode
    groupSize
    studyStyle
  }
}
```
**Expected Outcome:** Updates and returns the user's study preferences.

---

### 9. Get My Profile

**Query:**
```graphql
query GetMyProfile {
  getMyProfile {
    id
    userId
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
      studyPace
      studyMode
      groupSize
      studyStyle
    }
  }
}
```
**Expected Outcome:** Returns the full nested profile of the currently authenticated user.

---

### 10. Get Profile By User ID

**Query:**
```graphql
query GetProfile {
  getProfileByUserId(userId: "<OTHER_USER_ID>") {
    id
    topics {
      name
    }
    preferences {
      studyMode
    }
  }
}
```
**Expected Outcome:** Returns the profile details for a specific user ID.
