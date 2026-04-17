# Matching Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Matching Service functionality.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

*Note: The Matching service relies on populated data in Profile and Availability to generate accurate score recommendations.*

---

### 1. Get Potential Matches (The Algorithm)

**Query:**
```graphql
query GetMatches {
  getPotentialMatches {
    userId
    score
    reason
    commonCourses
    commonTopics
    requestStatus
  }
}
```
**Expected Outcome:** Returns an array of suggested buddies, scored and ranked, with reasons for the match based on shared courses/topics.

---

### 2. Send Buddy Request

**Mutation:**
```graphql
mutation SendRequest {
  sendBuddyRequest(toUser: "<TARGET_USER_ID>") {
    id
    fromUser
    toUser
    status
    createdAt
  }
}
```
**Expected Outcome:** Creates a pending buddy request and returns it.

---

### 3. Get Buddy Requests (Inbox)

**Query:**
```graphql
query GetRequests {
  getBuddyRequests {
    id
    fromUser
    toUser
    status
    createdAt
  }
}
```
**Expected Outcome:** Returns requests received by the current user.

---

### 4. Accept Buddy Request

**Mutation:**
```graphql
mutation AcceptRequest {
  acceptBuddyRequest(requestId: "<REQUEST_ID>") {
    id
    status
  }
}
```
**Expected Outcome:** Changes status to "ACCEPTED" and returns the request.

---

### 5. Reject Buddy Request

**Mutation:**
```graphql
mutation RejectRequest {
  rejectBuddyRequest(requestId: "<REQUEST_ID>") {
    id
    status
  }
}
```
**Expected Outcome:** Changes status to "REJECTED" and returns the request.

---

### 6. Get Connections (My Buddies)

**Query:**
```graphql
query GetConnections {
  getConnections {
    userId
  }
}
```
**Expected Outcome:** Returns an array of user IDs representing accepted buddy connections.
