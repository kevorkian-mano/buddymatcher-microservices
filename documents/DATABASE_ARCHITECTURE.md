# Database Architecture

This application utilizes a **Microservices Architecture**. Instead of one giant, monolithic database, there are **7 separate PostgreSQL databases** operating independently. 

They interact primarily through **Foreign Keys (Soft Links)** using the `userId`, and they communicate asynchronously through **Kafka Event Messages** (e.g., when a User registers, the Profile service might get a Kafka message telling it to initialize a profile).

Here is a full breakdown of every database, the tables it holds, and how they interact.

---

## 1. User Database (`user-service`)
**Purpose:** Handles authentication and core identity.
**Table:** `User`
- **id** (String, Primary Key) – The ultimate source of truth linking all systems. 
- **name, email, passwordHash** – Standard identity data.
- **university, academicYear, contactInfo** – Basic details.
- **Interaction:** Every other microservice saves this `id` as `userId` to know exactly who owns what data.

---

## 2. Profile Database (`profile-service`)
**Purpose:** Stores academic metadata for the user needed for finding buddies.
**Tables:**
- **Profile**
  - **id** (Primary Key)
  - **userId** (Unique) – Links back to User DB.
- **Course**
  - **id, name, code** – E.g. "Data Structures", "CS201".
  - **profileId** – Connects to Profile. If a Profile is deleted, Prisma's `Cascade` deletes all associated Courses.
- **Topic**
  - **id, name** – E.g. "Binary Trees", "Sorting Algorithms".
  - **profileId** – Connects to Profile.
- **Preferences**
  - **id**
  - **profileId** (Unique) – One-to-one relationship with Profile.
  - **studyPace, studyMode, groupSize, studyStyle** – Tells the matching engine how the user works.

---

## 3. Availability Database (`availability-service`)
**Purpose:** Stores the exact times of the week a user is free to study.
**Table:** `AvailabilitySlot`
- **id** (Primary Key)
- **userId** – Links back to User DB.
- **dayOfWeek** (Int: 0-6 where 0=Sunday)
- **startTime, endTime** (String "HH:MM")
- **Interaction:** Enforces a unique constraint so a user cannot have two identical start times on the exact same day.

---

## 4. Matching Database (`matching-service`)
**Purpose:** Calculates compatibility. Because making external HTTP calls to Profile and Availability every single time a match is calculated is too slow, this database caches necessary info.
**Table:** `MatchCandidate`
- **id** (Primary Key)
- **userId** – Links back to User DB.
- **courses, topics** (Arrays of Strings) – Flattened versions of the Profile DB tables for lightning-fast comparisons.
- **studyPace, studyMode, studyStyle** – Flattened preferences.
- **availability (JSON)** – Flatted availability slots.
- **Interaction:** When a user updates their Profile or Availability, those microservices send a Kafka Event. The Matching service listens to Kakfa and updates this internal `MatchCandidate` cache table to keep the data fresh!

---

## 5. Session Database (`session-service`)
**Purpose:** Handles active study rooms/groups.
**Tables:**
- **StudySession**
  - **id** (Primary Key)
  - **creatorId** – Links to User DB. The host.
  - **topic, startTime, duration, sessionType, location** – Event metadata.
- **SessionParticipant**
  - **id** (Primary Key)
  - **sessionId** – Links to StudySession.
  - **userId** – Links to User DB. The attendee.
  - **status** (String default "JOINED" or "LEFT").
- **Interaction:** When a user joins, a rule enforces uniqueness `[sessionId, userId]` so someone can't join the exact same session twice.

---

## 6. Messaging Database (`messaging-service`)
**Purpose:** Logs chat messages for sessions or direct DMs.
**Table:** `Message`
- **id** (Primary Key)
- **conversationId** (String) – This acts as a generic room ID. In most cases, this is equal to a `sessionId` (from session-service).
- **senderId** – Links to User DB. Let's the front end know who wrote it.
- **content, createdAt** – Chat contents and timestamp.

---

## 7. Notification Database (`notification-service`)
**Purpose:** Pushes alerts to users based on background events.
**Table:** `Notification`
- **id** (Primary Key)
- **userId** – Links to User DB. The person who should see this alert.
- **type** – Category (e.g. `MATCH_FOUND`, `SESSION_INVITE`).
- **content** – The text string (e.g. "Bob Joined your Study Group").
- **read** (Boolean) – Default: `false`.
- **Interaction:** Completely driven by Kafka. When the `session-service` writes a new `SessionParticipant` to its DB, it triggers a `SESSION_JOINED` Kafka event. The `notification-service` consumes that event and generates a row in this DB instantly.

---

## The Big Picture (Data Flow Example)
1. **User Registration.** The frontend sends a mutation to Gateway $\to$ Gateway sends it to `user-service`. The `User` database creates the user.
2. **Profile Setup.** Frontend hits Gateway $\to$ Gateway passes the `JWT Token` and data to `profile-service`. The `Profile`, `Course`, and `Topic` databases update.
3. **Kafka Trigger.** `profile-service` says "Hey everybody, Profile updated!" over the Kafka network.
4. **Cache Updating.** `matching-service` hears the Kafka message and quietly updates `MatchCandidate` in the background.
5. **Session Hosted.** A user creates a session via `session-service`. A `StudySession` row is generated.
6. **Chatting.** Users chat in the group. The front end sends mutations to `messaging-service` using the Session ID as the room (`conversationId`). `Message` records generate.
7. **System Unity.** Despite everything living on different physical databases, Apollo Gateway stitches them together, making the Front End think there is just one giant super-database!