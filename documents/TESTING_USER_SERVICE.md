# User Service - Apollo Testing Guide

## Overview
This guide provides the necessary GraphQL queries and mutations to test the User Service functionality via Apollo Studio or Postman.

## Pre-requisites
- Ensure the gateway and user-service are running.
- Set the endpoint to `http://localhost:4000/graphql` for the gateway.
- For queries/mutations marked as `[Authenticated]`, include a valid JWT token in the `Authorization` header (`Bearer <YOUR_TOKEN>`).

---

### 1. Register a New User

**Mutation:**
```graphql
mutation RegisterUser {
  register(
    name: "John Doe"
    email: "john.doe@example.com"
    password: "securepassword123"
    university: "State University"
    major: "Computer Science"
    academicYear: "Sophomore"
    contactInfo: "@johndoe_telegram"
    birthdate: "2000-05-15"
  ) {
    token
    user {
      id
      name
      email
      university
      major
    }
  }
}
```
**Expected Outcome:** Returns a JWT `token` and the `user` object. Note the token for authenticated requests.

---

### 2. Login

**Mutation:**
```graphql
mutation LoginUser {
  login(email: "john.doe@example.com", password: "securepassword123") {
    token
    user {
      id
      name
    }
  }
}
```
**Expected Outcome:** Returns a JWT `token` and the `user` object.

---

### 3. Get Current User `[Authenticated]`

**Query:**
```graphql
query GetCurrentUser {
  me {
    id
    name
    email
    university
    major
    academicYear
    contactInfo
    birthdate
    createdAt
  }
}
```
**Expected Outcome:** Returns the details of the logged-in user.

---

### 4. Get User By ID `[Authenticated]`

**Query:**
```graphql
query GetUser {
  getUserById(id: "<USER_ID>") {
    id
    name
    email
    major
  }
}
```
**Expected Outcome:** Returns the user details for the provided ID.

---

### 5. Get All Users `[Authenticated]`

**Query:**
```graphql
query GetAllUsers {
  getAllUsers {
    id
    name
    email
    major
    university
  }
}
```
**Expected Outcome:** Returns an array of all registered users.

---

### 6. Update Profile `[Authenticated]`

**Mutation:**
```graphql
mutation UpdateUserProfile {
  updateProfile(
    name: "Johnathan Doe"
    major: "Software Engineering"
    academicYear: "Junior"
  ) {
    id
    name
    major
    academicYear
  }
}
```
**Expected Outcome:** Updates and returns the specified user fields.
