# Matching Service Testing Guide

This guide explains how the Matching Algorithm works in the application and provides verifiable edge cases that cover all functional requirements.

## 1. Matching Algorithm Rules
The compatibility score between the current user (`me`) and a `candidate` is calculated out of 100% using the following weights:

| Criteria | Points | Condition |
|----------|--------|-----------|
| **Courses** | +20 | Per exactly matched course string |
| **Topics** | +15 | Per exactly matched topic string |
| **Study Mode** | +10 | Must be an exact string match (e.g. 'In-person' == 'In-person') |
| **Study Pace** | +10 | Must be an exact string match (e.g. 'Fast' == 'Fast') |
| **Study Style** | +10 | Must be an exact string match (e.g. 'Visual' == 'Visual') |
| **Availability** | +15 | Must have at least 1 overlapping day of the week |

> **Note:** The final score is constrained mathematically not to exceed 100%.

## 2. Exclusion Rules (Visibility)
A candidate will **NOT** show up in the "Suggestions" view if:
- Their calculated score is `0`.
- The candidate is already connected to you (`ACCEPTED` state).
- The candidate has sent **you** a pending connection request (they appear in your "Requests" tab instead).
- The candidate is yourself.

If **you** have sent them a request that is still `PENDING`, they **WILL** appear, but the UI button will be disabled and display "Requested".

---

## 3. Seeded Edge Cases
By running the matching-service seed script, the following profiles and edge-case testing scenarios become available to your account for testing.

### Scenario A: The Perfect Match (100% Score)
* **Goal:** Verify the score capping algorithm.
* **Test User:** "Perfect Match Parker"
* **Setup:** SHARES 5 courses (+100 points), matching study mode (+10), matching pace (+10).
* **Expected Result:** Score calculates to 120 but is constrained and displays exactly **100%**.

### Scenario B: The Moderate Match
* **Goal:** Verify standard accumulative points.
* **Test User:** "Moderate Mary"
* **Setup:** Shares exactly 1 course (+20), 1 topic (+15). No matching study preferences.
* **Expected Result:** Score calculates to exactly **35%**.

### Scenario C: The Zero Percent Match
* **Goal:** Verify score-based exclusion.
* **Test User:** "Zero Match Zack"
* **Setup:** Uses completely different courses, topics, and study styles than you.
* **Expected Result:** Zack scores **0%** and is completely hidden from your Suggestions feed.

### Scenario D: The "Already Connected" User
* **Goal:** Verify that existing accepted friends don't clutter suggestions.
* **Test User:** "Connected Cody"
* **Setup:** Has a high match score, but a `BuddyRequest` database entry exists with status `ACCEPTED`.
* **Expected Result:** Hidden from "Suggestions", visible in "Connections".

### Scenario E: The "Incoming Request" User
* **Goal:** Verify incoming requests are correctly routed to the Requests tab.
* **Test User:** "Eager Ellie"
* **Setup:** Has a high match score, but sent you a `PENDING` request.
* **Expected Result:** Hidden from "Suggestions", visible with Accept/Decline action buttons in "Requests".

### Scenario F: The "Outgoing Request" User
* **Goal:** Verify outgoing UX button states.
* **Test User:** "Pending Paul"
* **Setup:** High match score, and you previously sent them a `BuddyRequest` that is currently `PENDING`.
* **Expected Result:** Visible in "Suggestions", but the action button is grayed out and labeled "Requested".

## 4. How to Test
1. Log into your primary testing account.
2. Form your baseline profile (Select 2 courses, 2 topics, set your pace/mode).
3. Access the `/matching` page.
4. Send a buddy request to a user on the feed and refresh. Verify that the button immediately grays out to "Requested" (Tests **Scenario F**).
5. Switch environments to log in as another user, send an invite to your primary account, log back into your primary account. 
6. Verify the user appears in the "Requests" tab and NOT in "Suggestions" (Tests **Scenario E**).
7. Accept that user in the "Requests" tab.
8. Verify they move strictly to the "Connections" tab (Tests **Scenario D**).
