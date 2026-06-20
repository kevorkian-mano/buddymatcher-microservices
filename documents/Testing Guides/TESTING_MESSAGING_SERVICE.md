# Messaging Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Messaging Service functionality.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

*Note: Conversations are usually bound by `conversationId`, which can be a shared Session ID or a 1-on-1 Buddy ID thread.*

---

### 1. Send Message

**Mutation:**
```graphql
mutation SendMessage {
  sendMessage(
    conversationId: "<CONVERSATION_ID_OR_SESSION_ID>"
    content: "Hey, are we still meeting for the study session today?"
  ) {
    id
    senderId
    conversationId
    content
    createdAt
  }
}
```
**Expected Outcome:** Commits the message to the database and returns the populated Message object.

---

### 2. Get Messages for Conversation

**Query:**
```graphql
query GetMessages {
  getMessages(conversationId: "<CONVERSATION_ID_OR_SESSION_ID>") {
    id
    senderId
    content
    createdAt
  }
}
```
**Expected Outcome:** Returns chronological array of all messages tied to that specific conversation ID.
