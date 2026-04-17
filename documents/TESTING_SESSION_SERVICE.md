# Session Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Session Service functionality.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

---

### 1. Create a Study Session

**Mutation:**
```graphql
mutation CreateSession {
  createSession(
    topic: "React Fundamentals"
    startTime: "2026-04-20T14:00:00Z"
    duration: 120
    sessionType: "VIRTUAL"
    location: "Zoom Link: https://zoom.us/..."
    contactInfo: "@my_telegram"
    invitedUserIds: ["<BUDDY_ID_1>", "<BUDDY_ID_2>"]
  ) {
    id
    creatorId
    topic
    status
    participants {
      userId
      status
    }
  }
}
```
**Expected Outcome:** Creates a new session and returns the basic details along with participant structures.

---

### 2. Update Session

**Mutation:**
```graphql
mutation UpdateSession {
  updateSession(
    sessionId: "<SESSION_ID>"
    topic: "React Advanced Hooks"
    status: "ACTIVE"
  ) {
    id
    topic
    status
  }
}
```
**Expected Outcome:** Updates the given fields of the session. Useful for testing the "Terminate" step by setting `status` to "COMPLETED".

---

### 3. Join Session

**Mutation:**
```graphql
mutation JoinSession {
  joinSession(
    sessionId: "<SESSION_ID>"
    contactInfo: "testuser_discord"
  ) {
    id
    participants {
      userId
      status
      contactInfo
    }
  }
}
```
**Expected Outcome:** Adds the current user to the session participants.

---

### 4. Leave Session

**Mutation:**
```graphql
mutation LeaveSession {
  leaveSession(sessionId: "<SESSION_ID>")
}
```
**Expected Outcome:** Returns `true`, removing the user from the participants list.

---

### 5. Cancel Session

**Mutation:**
```graphql
mutation CancelSession {
  cancelSession(sessionId: "<SESSION_ID>")
}
```
**Expected Outcome:** Returns `true`. Only the creator should be able to do this successfully.

---

### 6. Get All Sessions

**Query:**
```graphql
query GetAllSessions {
  getSessions {
    id
    topic
    startTime
    sessionType
    status
    creatorId
  }
}
```
**Expected Outcome:** Returns all active sessions visible to the user.

---

### 7. Get Session By ID

**Query:**
```graphql
query GetSession {
  getSessionById(id: "<SESSION_ID>") {
    id
    topic
    location
    participants {
      userId
      status
    }
  }
}
```
**Expected Outcome:** Returns specific details of a single session.
