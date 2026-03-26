# Complete End-to-End Testing Guide (Apollo Sandbox)

This document provides a comprehensive, step-by-step guide to testing the entire Real-Time Study Buddy application flow using GraphQL and Apollo Sandbox.

## Prerequisites
1. Ensure all Docker containers are running (`docker-compose up`).
2. Ensure the `gateway` is running perfectly on `http://localhost:4000/`.
3. Open [Apollo Sandbox](https://studio.apollographql.com/sandbox/explorer) and set the endpoint to `http://localhost:4000/`.
4. Keep a notepad or a scratch file open. You will need to copy/paste specific `ID`s and `Tokens` generated during these tests.

---

## Important: How to use Authentication Tokens
Some of the steps below require you to be "logged in."
When you register or login, you will receive a JWT `token`. To authenticate your future requests, you must add this token to the **Headers** at the bottom of the Apollo Sandbox.

Format of the Header:
```json
{
  "Authorization": "Bearer YOUR_COPIED_TOKEN_HERE"
}
```
*(Make sure to replace `YOUR_COPIED_TOKEN_HERE` with the actual long string from Step 1).*

---

## Step 1: Register User 1 (Alice)
**Target Service:** `user-service`
**No Header Required.**

**Mutation:**
```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    token
    user {
      id
      name
      email
    }
  }
}
```
**Variables:**
```json
{
  "name": "Alice",
  "email": "alice@study.com",
  "password": "password123"
}
```
**Action Items:**
1. Save Alice's `token` (we will call this `ALICE_TOKEN`).
2. Save Alice's `id` (we will call this `ALICE_ID`).

---

## Step 2: Register User 2 (Bob)
**Target Service:** `user-service`
**No Header Required.**

Run the same mutation as in Step 1, but with Bob's details.

**Variables:**
```json
{
  "name": "Bob",
  "email": "bob@study.com",
  "password": "password123"
}
```
**Action Items:**
1. Save Bob's `token` (we will call this `BOB_TOKEN`).
2. Save Bob's `id` (we will call this `BOB_ID`).

---

## Step 3: Setup Profile for Alice
**Target Service:** `profile-service`
**Header Needed:** Set the Header to contain `ALICE_TOKEN`.

**Mutation:**
```graphql
mutation SetupProfile($userId: ID!) {
  upsertProfile(userId: $userId) {
    id
    userId
  }
}
```
**Variables:**
```json
{
  "userId": "<PASTE_ALICE_ID_HERE>"
}
```

---

## Step 4: Add Courses and Topics to Alice's Profile
**Target Service:** `profile-service`
**Header Needed:** Set the Header to contain `ALICE_TOKEN`.

**Mutation:**
```graphql
mutation AddCourseAndTopic($courseName: String!, $courseCode: String, $topicName: String!) {
  addCourse(name: $courseName, code: $courseCode) {
    id
    name
  }
  addTopic(name: $topicName) {
    id
    name
  }
  updatePreferences(studyMode: "Virtual", groupSize: "Small") {
    id
    studyMode
  }
}
```
**Variables:**
```json
{
  "courseName": "Data Structures",
  "courseCode": "CS201",
  "topicName": "Binary Trees"
}
```

---

## Step 5: Setup Profile & Add Same Courses for Bob
**Target Service:** `profile-service`
**Header Needed:** Switch the Header to contain `BOB_TOKEN`.

Run the exact same queries from **Step 3** and **Step 4**, but use Bob's ID (`BOB_ID`) in Step 3. Because Bob and Alice now share similarities ("Data Structures", "Binary Trees"), the Matching Algorithm will detect them.

---

## Step 6: Add Availability (Alice)
**Target Service:** `availability-service`
**Header Needed:** Switch back to `ALICE_TOKEN`.

**Mutation:**
```graphql
mutation AddAvailability($dayOfWeek: Int!, $startTime: String!, $endTime: String!) {
  addAvailabilitySlot(dayOfWeek: $dayOfWeek, startTime: $startTime, endTime: $endTime) {
    id
    dayOfWeek
    startTime
    endTime
  }
}
```
**Variables:**
```json
{
  "dayOfWeek": 3,
  "startTime": "14:00",
  "endTime": "16:00"
}
```
*(Note: dayOfWeek uses 0-6 where 0 is Sunday, so 3 is Wednesday).*

---

## Step 7: Test the Matching Service
**Target Service:** `matching-service`
**Header Needed:** `ALICE_TOKEN`

Since Alice and Bob share the same course and topic, Alice should see Bob as a recommended match.

**Query:**
```graphql
query GetPotentialMatches {
  getPotentialMatches {
    userId
    score
    reason
    commonCourses
    commonTopics
  }
}
```
*(You should see Bob's User ID returned here with a high compatibility score!)*

---

## Step 8: Create a Study Session (Alice)
**Target Service:** `session-service`
**Header Needed:** `ALICE_TOKEN`

Alice invites Bob (or leaves it open) by creating a study session.

**Mutation:**
```graphql
mutation CreateSession($topic: String!, $startTime: String!, $duration: Int!, $sessionType: String!) {
  createSession(topic: $topic, startTime: $startTime, duration: $duration, sessionType: $sessionType) {
    id
    topic
    creatorId
    participants {
      userId
      status
    }
  }
}
```
**Variables:**
```json
{
  "topic": "Binary Trees Study Group",
  "startTime": "2026-03-25T14:00:00Z",
  "duration": 120,
  "sessionType": "Virtual"
}
```
**Action Item:** Save the Session `id`. You will need this for Bob to join. We will call it `SESSION_ID`.

---

## Step 9: Join the Study Session (Bob)
**Target Service:** `session-service`
**Header Needed:** Switch to `BOB_TOKEN`.

Bob decides to join Alice's newly created session.

**Mutation:**
```graphql
mutation JoinSession($sessionId: ID!) {
  joinSession(sessionId: $sessionId) {
    id
    topic
    participants {
      userId
      status
    }
  }
}
```
**Variables:**
```json
{
  "sessionId": "<PASTE_SESSION_ID_HERE>"
}
```

---

## Step 10: Send a Message in the Group (Bob)
**Target Service:** `messaging-service`
**Header Needed:** `BOB_TOKEN`

Bob sends a message to the group communicating with Alice. (We will use the `SESSION_ID` as the `conversationId` for simplicity).

**Mutation:**
```graphql
mutation SendMessage($conversationId: ID!, $content: String!) {
  sendMessage(conversationId: $conversationId, content: $content) {
    id
    senderId
    content
    createdAt
  }
}
```
**Variables:**
```json
{
  "conversationId": "<PASTE_SESSION_ID_HERE>",
  "content": "Hey Alice, I just joined the study session. Ready to learn about Binary Trees?"
}
```

---

## Step 11: Read Notifications (Alice)
**Target Service:** `notification-service`
**Header Needed:** Switch back to `ALICE_TOKEN`.

Through Kafka, the system should have generated a notification for Alice saying Bob joined her session. Let's check her notification inbox.

**Query:**
```graphql
query GetMyNotifications {
  getMyNotifications {
    id
    type
    content
    read
    createdAt
  }
}
```
*(You should see an unread notification about Bob joining!)*

---

## Step 12: Mark Notification as Read (Alice)
**Target Service:** `notification-service`
**Header Needed:** `ALICE_TOKEN`

**Mutation:**
```graphql
mutation MarkRead($id: ID!) {
  markNotificationRead(id: $id)
}
```
**Variables:**
```json
{
  "id": "<PASTE_NOTIFICATION_ID_FROM_PREVIOUS_STEP_HERE>"
}
```

---

## Conclusion
If you completed all 12 steps successfully, you have proven that:
1. Users can register and Authenticate via JWT (Authentication layer).
2. Profiles can be updated and linked to databases (Data mutation).
3. The Matching service correctly parses multiple user's attributes (Logic layer).
4. The Session and Messaging systems can tie multiple users to unified state representations (Relationship architecture).
5. The Event-Driven Kafka Messaging architecture successfully emits, captures, and creates Notifications asynchronously (Asynchronous Microservice communications).

**You have successfully proved full End-to-End Application Integrity!**