# Notification Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Notification Service functionality.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

*Note: Since notifications are created asynchronously via Kafka events (like receiving a buddy request, or a session being created), there is no manual "createNotification" GraphQL mutation to test directly. Trigger events in other services first to populate this database.*

---

### 1. Get My Notifications

**Query:**
```graphql
query GetNotifications {
  getMyNotifications {
    id
    type
    content
    read
    createdAt
  }
}
```
**Expected Outcome:** Returns an array of notification alerts for the currently logged-in user.

---

### 2. Mark Notification as Read

**Mutation:**
```graphql
mutation MarkRead {
  markNotificationRead(id: "<NOTIFICATION_ID>")
}
```
**Expected Outcome:** Returns `true`. If you re-run the `getMyNotifications` query, the specific `read` field should now be `true`.
