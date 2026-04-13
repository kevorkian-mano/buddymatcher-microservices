# Comprehensive End-to-End (E2E) GraphQL Testing Flow

This guide provides a complete, step-by-step workflow to test the entire ecosystem of your microservices using an Apollo GraphQL client (like Apollo Studio, Postman, or Hoppscotch).

This flow will simulate **two users** interacting with the system: **User A (Alice)** and **User B (Bob)**. They will register, set up their profiles so they are compatible, match with each other, schedule a study session, and exchange messages.

---

## 🛠 Prerequisites: Authentication Setup
For any queries/mutations after Step 1, you must pass the generated JWT token in the HTTP Headers of your GraphQL client.
```json
{
  "authorization": "<YOUR_TOKEN_HERE>"
}
```

---

## 🟢 Phase 1: User & Authentication Service

### 1. Register User A (Alice)
**Mutation:**
```graphql
mutation RegisterAlice($name: String!, $email: String!, $password: String!, $university: String, $major: String) {
  register(name: $name, email: $email, password: $password, university: $university, major: $major) {
    token
    user { id name }
  }
}
```
**Variables:**
```json
{
  "name": "Alice Smith",
  "email": "alice@university.edu",
  "password": "Password123!",
  "university": "State University",
  "major": "Computer Science"
}
```
> ⚠️ **Action:** Save Alice's `token` and `user.id` for later steps.

### 2. Register User B (Bob)
**Variables:** *(Use the same mutation as above)*
```json
{
  "name": "Bob Jones",
  "email": "bob@university.edu",
  "password": "Password123!",
  "university": "State University",
  "major": "Computer Science"
}
```
> ⚠️ **Action:** Save Bob's `token` and `user.id`.

*(If you need to log in again later, use the `login(email, password)` mutation to get a fresh token).*

---

## 🔵 Phase 2: Profile & Preferences Service
*Set your authorization header to **Alice's Token**.*

### 2.5 Ensure Profile Exists (Alice)
If your profile wasn't auto-created, run this first to initialize it.
**Mutation:**
```graphql
mutation UpsertProfile($userId: ID!) {
  upsertProfile(userId: $userId) {
    id
    userId
  }
}
```
**Variables:** `{"userId": "<ALICES_USER_ID>"}`


### 3. Add Courses (Alice)
**Mutation:**
```graphql
mutation AddCourse($name: String!, $code: String) {
  addCourse(name: $name, code: $code) { id name code }
}
```
**Variables:** `{"name": "Data Structures", "code": "CS101"}`

### 4. Add Topics (Alice)
**Mutation:**
```graphql
mutation AddTopic($name: String!) {
  addTopic(name: $name) { id name }
}
```
**Variables:** `{"name": "Binary Trees"}`

### 5. Update Preferences (Alice)
Make sure Alice prefers In-Person and Fast pace.
**Mutation:**
```graphql
mutation UpdatePreferences($studyMode: String, $studyPace: String, $studyStyle: String) {
  updatePreferences(studyMode: $studyMode, studyPace: $studyPace, studyStyle: $studyStyle) {
    studyMode studyPace studyStyle
  }
}
```
**Variables:** `{"studyMode": "In-Person", "studyPace": "Fast", "studyStyle": "Visual"}`

> ⚠️ **Action:** Now, change your authorization header to **Bob's Token** and **REPEAT Steps 3, 4, and 5** using identical courses, topics, and preferences. This ensures they get a high compatibility score!

*(⚙️ Behind the scenes: Kafka fires `UserPreferencesUpdated` events to the Matching Service).*

---

## 🟡 Phase 3: Availability Service
*Ensure your header is still **Bob's Token**.*

### 6. Set Availability for Bob (Sunday 10:00 - 12:00)
**Mutation:**
```graphql
mutation AddAvailabilitySlot($dayOfWeek: Int!, $startTime: String!, $endTime: String!) {
  addAvailabilitySlot(dayOfWeek: $dayOfWeek, startTime: $startTime, endTime: $endTime) {
    id dayOfWeek startTime endTime
  }
}
```
**Variables:** `{"dayOfWeek": 0, "startTime": "10:00", "endTime": "12:00"}`

> ⚠️ **Action:** Change header back to **Alice's Token** and run the exact same mutation so their free schedules overlap.

*(⚙️ Behind the scenes: Kafka fires `AvailabilityUpdated` locking in their sync).*

---

## 🟠 Phase 4: Matching Service
*Keep header as **Alice's Token**.*

### 7. Find Potential Matches
Because Alice and Bob have the exact same major, courses, topics, preferences, and availability, Bob will appear with a high score.
**Query:**
```graphql
query GetMyMatches {
  getPotentialMatches {
    userId
    score
    reason
    commonCourses
  }
}
```
> **Expected Output:** Bob's `userId` with a score close to 100.

### 8. Send Buddy Request to Bob
**Mutation:**
```graphql
mutation SendRequest($toUser: ID!) {
  sendBuddyRequest(toUser: $toUser) { id status }
}
```
**Variables:** `{"toUser": "<BOBS_USER_ID>"}`
> Save the returned Request `id`.
*(⚙️ Behind the scenes: Kafka fires `BuddyRequestCreated`).*

### 9. Accept Buddy Request (as Bob)
> ⚠️ **Action:** Change header to **Bob's Token**.
**Mutation:**
```graphql
mutation AcceptRequest($requestId: ID!) {
  acceptBuddyRequest(requestId: $requestId) { id status }
}
```
**Variables:** `{"requestId": "<THE_REQUEST_ID_FROM_STEP_8>"}`

---

## 🟣 Phase 5: Notification Service
*Header is still **Bob's Token**.*

### 10. Check Notifications
Let's verify Bob received a notification about Alice's request.
**Query:**
```graphql
query GetNotifications {
  getMyNotifications {
    id type content read createdAt
  }
}
```
> **Expected Output:** Notifications of type `MATCH_FOUND` and `BUDDY_REQUEST`.

---

## 🔴 Phase 6: Study Session Scheduling Service
> ⚠️ **Action:** Change header to **Alice's Token**.

### 11. Create a Study Session
**Mutation:**
```graphql
mutation CreateSession($topic: String!, $startTime: String!, $duration: Int!, $sessionType: String!, $location: String, $contactInfo: String) {
  createSession(topic: $topic, startTime: $startTime, duration: $duration, sessionType: $sessionType, location: $location, contactInfo: $contactInfo) {
    id
    topic
    creatorContactInfo
  }
}
```
**Variables:**
```json
{
  "topic": "Binary Trees Prep",
  "startTime": "2026-04-10T10:00:00Z",
  "duration": 120,
  "sessionType": "IN_PERSON",
  "location": "Library Room B",
  "contactInfo": "alice@university.edu"
}
```
> ⚠️ **Action:** Save the returned Session `id`.
*(⚙️ Behind the scenes: Kafka fires `StudySessionCreated` to the Notification service).*

### 12. Join the Session (as Bob)
> ⚠️ **Action:** Change header to **Bob's Token**.
**Mutation:**
```graphql
mutation JoinSession($sessionId: ID!, $contactInfo: String) {
  joinSession(sessionId: $sessionId, contactInfo: $contactInfo) {
    id
    participants { userId contactInfo }
  }
}
```
**Variables:**
```json
{
  "sessionId": "<THE_SESSION_ID>",
  "contactInfo": "bob-discord-username"
}
```

---

## 🟤 Phase 7: Messaging / Chat Service
*Header is still **Bob's Token**.*

### 13. Send a Message to Alice
We use Alice's `userId` as the "conversationId" for direct DMs.
**Mutation:**
```graphql
mutation SendMessage($conversationId: ID!, $content: String!) {
  sendMessage(conversationId: $conversationId, content: $content) {
    id content createdAt
  }
}
```
**Variables:** `{"conversationId": "<ALICE_USER_ID>", "content": "Hey Alice! I joined the session. Catch you at the Library!"}`

### 14. Check Messages (as Alice)
> ⚠️ **Action:** Change header to **Alice's Token**.
**Query:**
```graphql
query CheckMessages($conversationId: ID!) {
  getMessages(conversationId: $conversationId) {
    id senderId content
  }
}
```
**Variables:** `{"conversationId": "<BOBS_USER_ID>"}`

---

## ⚫ Phase 8: Cleanup (Optional)
### 15. Cancel the Session (as Alice)
**Mutation:**
```graphql
mutation CancelSession($sessionId: ID!) {
  cancelSession(sessionId: $sessionId)
}
```
**Variables:** `{"sessionId": "<THE_SESSION_ID>"}`

---
**🎉 Done!** If you hit all 15 steps without errors, your backend microservices, Gateway resolver federation, NeonDB mappings, and Kafka event streaming pipeline are functioning flawlessly at 100% capacity!
