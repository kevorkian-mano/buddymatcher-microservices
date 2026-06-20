# Availability Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the Availability Service functionality.

## Pre-requisites
- Gateway endpoint: `http://localhost:4000/graphql`
- All requests require a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

---

### 1. Add Availability Slot

**Mutation:**
```graphql
mutation AddAvailability {
  addAvailabilitySlot(
    dayOfWeek: 1     # 1 = Monday
    startTime: "09:00"
    endTime: "11:00"
  ) {
    id
    dayOfWeek
    startTime
    endTime
  }
}
```
**Expected Outcome:** Returns the created availability slot.

---

### 2. Update Availability Slot

**Mutation:**
```graphql
mutation UpdateAvailability {
  updateAvailabilitySlot(
    id: "<SLOT_ID>"
    startTime: "10:00"
    endTime: "12:00"
  ) {
    id
    startTime
    endTime
  }
}
```
**Expected Outcome:** Updates and returns the slot details.

---

### 3. Delete Availability Slot

**Mutation:**
```graphql
mutation DeleteAvailability {
  deleteAvailabilitySlot(id: "<SLOT_ID>")
}
```
**Expected Outcome:** Returns `true` if deleted successfully.

---

### 4. Add Free Day

**Mutation:**
```graphql
mutation AddFreeDay {
  addFreeDay(dayOfWeek: 6) { # 6 = Saturday
    id
    dayOfWeek
  }
}
```
**Expected Outcome:** Returns the created FreeDay.

---

### 5. Remove Free Day

**Mutation:**
```graphql
mutation RemoveFreeDay {
  removeFreeDay(dayOfWeek: 6)
}
```
**Expected Outcome:** Returns `true` if removed successfully.

---

### 6. Get My Availability

**Query:**
```graphql
query GetMyAvailability {
  getMyAvailability {
    id
    dayOfWeek
    startTime
    endTime
  }
}
```
**Expected Outcome:** Returns an array of all defined availability slots for the current user.

---

### 7. Get My Free Days

**Query:**
```graphql
query GetMyFreeDays {
  getMyFreeDays {
    id
    dayOfWeek
  }
}
```
**Expected Outcome:** Returns an array of the user's free days.

---

### 8. Get Availability By User ID

**Query:**
```graphql
query GetUserAvailability {
  getAvailabilityByUserId(userId: "<OTHER_USER_ID>") {
    dayOfWeek
    startTime
    endTime
  }
}
```
**Expected Outcome:** Returns availability slots for a specific user ID.
