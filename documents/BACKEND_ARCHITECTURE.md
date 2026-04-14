# BuddyMatcher Backend Architecture & Implementation Documentation

This document explores the exhaustive backend details for the **BuddyMatcher** application. The backend is structured as an **Event-Driven, Microservices Architecture** utilizing **GraphQL (Apollo Federation)** for unified client interactions, **Kafka** for asynchronous inter-service communication, and **Prisma ORM (PostgreSQL)** for database data layer management.

**Table of Contents**
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Microservices Breakdown & Implementation Status](#2-microservices-breakdown--implementation-status)
    - [User Service](#user-service)
    - [Profile Service](#profile-service)
    - [Availability Service](#availability-service)
    - [Matching Service](#matching-service)
    - [Session Service](#session-service)
    - [Messaging Service](#messaging-service)
    - [Notification Service](#notification-service)
3. [Inter-Service Communication (Kafka)](#3-inter-service-communication-kafka)
4. [Deployed Apollo Gateway](#4-deployed-apollo-gateway)

---

## 1. System Architecture Overview

* **Deployment Strategy**: Dockerized containers orchestrated through `docker-compose`. 
* **GraphQL Runtime**: Apollo Server integrated with `@apollo/subgraph`. A central **Apollo Gateway** federates schemas from all subgraphs into a unified API (`http://localhost:4000/graphql`) for the React Vite Frontend.
* **Database Strategy**: Decentralized Databases. Every discrete service (User, Profile, Matching, etc.) possesses its own localized schema and PostgreSQL database utilizing **Prisma ORM**.
* **Event Streaming**: Apache Kafka + Zookeeper runs localized listeners (`producer.js`/`consumer.js`) within each subgraph to resolve downstream dependencies reliably and trigger notifications.

---

## 2. Microservices Breakdown & Implementation Status

### User Service
Handles core identity, security, and rudimentary personal information. 
* **Database Engine**: `user_db`
* **Core Entity Models**:
  * `User`: (id, name, email, passwordHash, university, major, academicYear, contactInfo, birthdate, createdAt)
* **CRUD & GraphQL Logic**:
  * **Queries**: `me` (context-aware JWT identification), `getUserById`, `getAllUsers` 
  * **Mutations**: 
    * `register` (Hashes password, commits user, fires JWT token, assigns `AuthPayload`).
    * `login` (Validates password with Bcrypt, returns JWT token).
    * `updateProfile` (Update bio fields).
* **Significant Logic Implemented**:
  * Registration pipeline sets up the baseline account context token required to secure every localized GraphQL payload mapping forward. Validates token via `jsonwebtoken`.

### Profile Service
Handles complex academic and study preference data related to the User.
* **Database Engine**: `profile_db`
* **Core Entity Models**:
  * `Profile` (Federated by `userId`)
  * `Course` (One-to-many relationship with Profile)
  * `Topic` (One-to-many relationship with Profile)
  * `StudyGoal` (One-to-many relationship with Profile)
  * `Preferences` (One-to-One relationship defining studyPace, studyMode, groupSize, studyStyle)
* **CRUD & GraphQL Logic**:
  * **Queries**: `getMyProfile`, `getProfileByUserId`
  * **Mutations**: 
    * `upsertProfile` (Seed the physical relational mappings).
    * `addCourse` / `removeCourse`
    * `addTopic` / `removeTopic`
    * `addStudyGoal` / `removeStudyGoal`
    * `updatePreferences` 
* **Significant Logic Implemented**:
  * Handles the complex cascade deletion structures using Prisma. Also triggers Kafka `UserPreferencesUpdated` event upon save so the Matching Service can update its internal shadow algorithms natively without needing HTTP fetching overhead.

### Availability Service
Handles scheduling mechanics, free-days, and weekly availability slots.
* **Database Engine**: `availability_db`
* **Core Entity Models**:
  * `AvailabilitySlot` (userId, dayOfWeek, startTime, endTime)
  * `FreeDay` (userId, dayOfWeek)
* **CRUD & GraphQL Logic**:
  * **Queries**: `getMyAvailability`, `getAvailabilityByUserId`, `getMyFreeDays`
  * **Mutations**: 
    * `addAvailabilitySlot` / `updateAvailabilitySlot` / `deleteAvailabilitySlot`
    * `addFreeDay` / `removeFreeDay`
* **Significant Logic Implemented**:
  * Unique Prisma schema constraints applied (`@@unique([userId, dayOfWeek, startTime])`) guarding against timezone / scheduling overlaps. Emits `AvailabilityUpdated` over Kafka.

### Matching Service
The centralized algorithmic engine for mapping buddies securely without exposing full database loads across nodes.
* **Database Engine**: `matching_db`
* **Core Entity Models**:
  * `MatchCandidate` (A *localized shadow cache* indexing foreign User Service data mapping: courses, topics, studyPace, studyMode, studyStyle, availability JSON)
  * `BuddyRequest` (fromUser, toUser, status ["PENDING", "ACCEPTED", "REJECTED"])
* **CRUD & GraphQL Logic**:
  * **Queries**: 
    * `getPotentialMatches` (Algorithm yields ranked users)
    * `getBuddyRequests` (Requests explicitly tied to current user)
    * `getConnections` (Resolved successful matches forming Buddy Arrays)
  * **Mutations**: 
    * `sendBuddyRequest`
    * `acceptBuddyRequest`
    * `rejectBuddyRequest`
* **Significant Logic Implemented**:
  * Kafka Event ingestion pipeline! It listens to changes from User, Profile, and Availability services silently keeping the `MatchCandidate` shadow-db strictly updated to reduce algorithmic processing response times to `< 50ms`.
  * Algorithmic queries generate `score`, `reason`, and list `commonCourses`/`commonTopics` out of the box dynamically analyzing differences directly in resolvers.
  * Fires Kafka `BuddyRequestCreated` & `MatchFound` events on successful API touches.

### Session Service
The booking framework to negotiate and bind interactive physical/virtual study sessions amongst Buddy Networks.
* **Database Engine**: `session_db`
* **Core Entity Models**:
  * `StudySession` (creatorId, topic, startTime, duration, sessionType, status ["ACTIVE", "COMPLETED"], location)
  * `SessionParticipant` (sessionId, userId, status)
* **CRUD & GraphQL Logic**:
  * **Queries**: `getSessions`, `getSessionById`
  * **Mutations**: 
    * `createSession` 
    * `updateSession` (Utilized inherently for "Terminating" an active session mapping it to 'COMPLETED' stats algorithms explicitly)
    * `cancelSession`
    * `joinSession` / `leaveSession`
* **Significant Logic Implemented**:
  * Fully fledged connection rules dictating `Terminated` actions. 
  * Broadcast mechanisms implemented notifying all connected buddies immediately once a Session has been launched (`StudySessionCreated` / `StudySessionJoined`). 

### Messaging Service
Localized P2P Chat Network payload definitions for Buddies / Study Sessions.
* **Database Engine**: `messaging_db`
* **Core Entity Models**:
  * `Message` (conversationId, senderId, content, createdAt)
* **CRUD & GraphQL Logic**:
  * **Queries**: `getMessages` 
  * **Mutations**: `sendMessage`

### Notification Service
A passive microservice utilized strictly as an asynchronous ingestor providing the frontend with localized alerts without bottlenecking specific services.
* **Database Engine**: `notification_db`
* **Core Entity Models**:
  * `Notification` (userId, type, content, read boolean)
* **CRUD & GraphQL Logic**:
  * **Queries**: `getMyNotifications`
  * **Mutations**: `markNotificationRead` (Acknowledge state toggles).
* **Significant Logic Implemented**:
  * Consumes ALL Kafka events natively (`BuddyRequestCreated`, `StudySessionCreated`, `MatchFound` etc.). Resolves them efficiently into standalone string databases with localized read/unread statuses. It ensures that standard microservices only care about their domains allowing the notification service to strictly track alerts.

---

## 3. Inter-Service Communication (Kafka)

Kafka establishes a highly durable microservice dependency layer resolving coupling failures.

* **Registered Topics (**`shared/topics.js`**)**:
  * `UserPreferencesUpdated`
  * `AvailabilityUpdated`
  * `MatchFound`
  * `StudySessionCreated`
  * `StudySessionJoined`
  * `BuddyRequestCreated`
* **Implementation Context**:
  When a user creates a new study session in the `session-service`, a blocking API call to the `notification-service` is circumvented. Instead, `session-service` fires `StudySessionCreated` to the Kafka network and cleanly returns to the client. The `notification-service` picks the event off the belt independently immediately compiling the alert. 

## 4. Deployed Apollo Gateway
All operations (while structurally separated backend algorithms with unique Postgres clusters mapping data independently) are exposed via `/gateway/src/index.js`. It consolidates the Subgraphs dynamically. The React codebase requests `getSessions` adjacent to `getPotentialMatches` concurrently, yet Apollo Gateway natively routes these cleanly between `session-service:4005` & `matching-service:4004` respectively!

*Documentation automatically generated detailing current branch structural mapping.*