# Functional & Non-Functional Requirements: Implementation Status

## 2.1 User and Authentication Service
### Functional Requirements
- **[Implemented]** Register a new account using basic information (name, email, password)
- **[Implemented]** Log in using email and password
- **[Implemented]** Generate an authentication token (JWT) after successful login
- **[Implemented]** Retrieve profile information for authenticated users
- **[Implemented]** Update basic profile details

### Non-functional Requirements
- **[Implemented]** Passwords securely stored using hashing (bcrypt)
- **[Implemented]** Authentication tokens used to protect GraphQL API
- **[Implemented]** Data privacy and prevention of unauthorized access (context authentication validation)

---

## 2.2 Profile and Study Preferences Service
### Functional Requirements
- **[Implemented]** Add and update courses being studied
- **[Implemented]** Define study preferences (pace, mode, group size, style)
- **[Implemented]** Add study topics/subjects for help
- **[Implemented]** View and update study preferences at any time
- **[Implemented]** Publish an event to Kafka whenever preferences or courses are updated

### Non-functional Requirements
- **[Implemented]** Updates processed rapidly (within standard latency margins)
- **[Implemented]** Modification restricted to the owner of the profile
- **[Implemented]** Architecture is designed to be scalable for concurrent requests

---

## 2.3 Availability Management Service
### Functional Requirements
- **[Implemented]** Define study availability during the week
- **[Implemented]** Update or view current availability schedule
- **[Implemented]** Delete existing availability slots
- **[Implemented]** Publish an event when availability is created or updated
- **[Implemented]** Prevent overlapping availability entries

### Non-functional Requirements
- **[Implemented]** Data accuracy when storing time slots
- **[Implemented]** Support simultaneous updates without data corruption

---

## 2.4 Matching Service
### Functional Requirements
- **[Implemented]** Analyze user info (courses, topics, availability, study preferences)
- **[Implemented]** Generate recommended study buddies based on compatibility
- **[Implemented]** Assign a compatibility score up to 100 to potential matches
- **[Implemented]** Allow users to view a list of recommended study partners
- **[Implemented]** Publish an event when a match is identified

### Non-functional Requirements
- **[Implemented]** Return recommendations rapidly
- **[Implemented]** Support multiple requests simultaneously
- **[Implemented]** Fair and consistent matching logic

---

## 2.5 Study Session Scheduling Service
### Functional Requirements
- **[Implemented]** Create a study session
- **[Implemented]** Join existing sessions
- **[Implemented]** Leave a session
- **[Missing]** Cancel (delete) a session
- **[Missing]** Update session details
- **[Missing]** Store/Integrate contact info of the session creator and receiver within the session details (only raw details are stored currently)
- **[Partially Implemented]** Notify other services when sessions are created/updated (Create is implemented via Kafka `StudySessionCreated`, but Updates/Cancels are not since mutations do not exist)

---

## 2.6 Notification Service
### Functional Requirements
- **[Implemented]** Notify users of important system events
- **[Implemented]** Notifications generated for "Match Found" and "Study Session Created"
- **[Missing]** Notifications generated for "Session Invitation Received" (No session invitation logic is present, only direct session creation and a base Buddy Request system)
- **[Implemented]** View notifications
- **[Implemented]** Mark notifications as read

---

## 2.7 Messaging / Chat Service (Bonus Feature)
### Functional Requirements
- **[Implemented]** Send messages between matched users
- **[Implemented]** Store a history of conversations
- **[Implemented]** View previous messages in a conversation
