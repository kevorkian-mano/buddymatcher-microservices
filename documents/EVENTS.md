# Event Architecture Documentation

## Overview
This document outlines the event-driven architecture of the platform, detailing every Kafka topic, its publisher, subscriber(s), and the payload schema used to transport data across microservices asynchronously.

## Kafka Topics

| Topic Name | Publisher | Consumer(s) | Description |
|---|---|---|---|
| `UserPreferencesUpdated` | Profile Service | Matching Service | Fired when a user adds/removes courses, topics, or alters their study preferences. Used to synchronize the matching database cache. |
| `AvailabilityUpdated` | Availability Service | Matching Service | Fired when a user adds/updates/deletes a weekly recurring availability slot. Triggers the Matching Service to update its free-time overlap caches. |
| `MatchFound` | Matching Service | Notification Service | Fired when a high-compatibility study buddy match is detected in the system for a given user. |
| `BuddyRequestCreated` | Matching Service | Notification Service | Fired when a user initiates a study buddy connection request to another candidate. |
| `StudySessionCreated` | Session Service | Notification Service | Fired when a new study session is successfully scheduled by a user. |
| `StudySessionJoined` | Session Service | Notification Service | Fired when an existing user joins a study session. |

---

## Detailed Event Schemas

### 1. `UserPreferencesUpdated`
- **Topic:** `UserPreferencesUpdated`
- **Trigger:** Adding/removing courses/topics, updating study modes remotely in the Profile Service.
- **Payload Structure:**
```json
{
  "userId": "uuid",
  "courses": [
    { "id": "uuid", "name": "Data Structures", "code": "COMP201" }
  ],
  "topics": [
    { "id": "uuid", "name": "Binary Trees" }
  ],
  "preferences": {
    "studyPace": "Fast",
    "studyMode": "Virtual",
    "studyStyle": "Discussion"
  }
}
```

### 2. `AvailabilityUpdated`
- **Topic:** `AvailabilityUpdated`
- **Trigger:** Modifications made to a user's timetable recurring schedule slots.
- **Payload Structure:**
```json
{
  "userId": "uuid",
  "slots": [
    {
      "id": "uuid",
      "dayOfWeek": 3,
      "startTime": "14:00",
      "endTime": "16:00"
    }
  ]
}
```

### 3. `MatchFound`
- **Topic:** `MatchFound`
- **Trigger:** Generated under the Matching Service `getPotentialMatches` query when an aggregate candidate score calculation is high.
- **Payload Structure:**
```json
{
  "fromUser": "uuid", // Who queried
  "toUser": "uuid",   // Who is recommended
  "score": 85
}
```

### 4. `BuddyRequestCreated`
- **Topic:** `BuddyRequestCreated`
- **Trigger:** Invoking the `sendBuddyRequest` Mutation inside the Matching Service. 
- **Payload Structure:**
```json
{
  "fromUser": "uuid", // Sender
  "toUser": "uuid"    // Recipient
}
```

### 5. `StudySessionCreated`
- **Topic:** `StudySessionCreated`
- **Trigger:** `createSession` Mutation in Session Service.
- **Payload Structure:**
```json
{
  "sessionId": "uuid",
  "creatorId": "uuid",
  "topic": "Algorithms Review",
  "startTime": "2026-03-27T10:00:00.000Z"
}
```

### 6. `StudySessionJoined`
- **Topic:** `StudySessionJoined`
- **Trigger:** `joinSession` Mutation in Session Service.
- **Payload Structure:**
```json
{
  "sessionId": "uuid",
  "userId": "uuid" // The user who joined
}
```