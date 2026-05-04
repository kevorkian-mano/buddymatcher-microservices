# Notification Lifecycle for "Match Found"

You're absolutely correct to notice this behavior, and it is a classic anti-pattern in GraphQL and distributed systems! Here is exactly why you're getting 80 notifications and how it works under the hood.

## 1. What is happening right now?
In your `matching-service/src/resolvers/index.js`, there is a GraphQL **Query** called `getPotentialMatches`. This query calculates compatibility scores for the authenticated user against other users.
At the very end of this calculation, the code does this:

```javascript
// In getPotentialMatches of matching-service
if (sorted.length > 0) {
  // Optional: publish match found event for the top match if it's new
  publishEvent('MatchFound', { fromUser: user.id, toUser: sorted[0].userId, score: sorted[0].score });
}
```

Then, the `notification-service` is listening to this Kafka event (`MatchFound`) via `consumer.js` and does this:

```javascript
// In notification-service
if (topic === 'MatchFound') {
  const { toUser, fromUser, score } = payload;
  await prisma.notification.create({
    data: {
      userId: fromUser, // The signed-in user
      type: 'MATCH_FOUND',
      content: `We found a new study buddy with ${score}% compatibility!`
    }
  });
}
```

### The Problem:
Every single time the frontend calls the `getPotentialMatches` query (which happens when you load the **Dashboard** and when you load the **Matching** page), the matching service re-calculates the matches. Because it's a `Query`, React/Apollo fetches it on page load, on React Component remounts, or when you navigate between tabs. 

Every time this query runs, it finds the top match and **blindly fires the Kafka event**. The notification service receives it and blindly inserts a new notification for the signed-in user (`fromUser`). That's why you get a duplicate notification of the same match *every single time you enter the system or click around*.

## 2. Why is this bad? (The Correct Way to Implement)
In GraphQL, **Queries** should be *idempotent* and *side-effect free*. This means fetching data should never alter the state of the system (like sending an email or creating a notification). Only **Mutations** (like `sendBuddyRequest`) should cause side-effects.

### The Correct Architectures for "Match Found" Notifications:

**Approach A: The "Event-Driven" Background Way (Best for Microservices)**
1. When a user updates their profile in the `profile-service`, it emits a `ProfileUpdated` Kafka event.
2. The `matching-service` listens to `ProfileUpdated`, recalculates matches *in the background*, and if it finds a new match above a certain threshold (e.g., >80%), it checks a database table (e.g., `NotifiedMatches`) to see if they've been notified about this specific user before.
3. If not, it saves the record and fires **one** `MatchFound` event.

**Approach B: The "Unique Notification" Check (Easiest Quick Fix)**
If you want to keep the event firing in the query (not recommended, but easy to patch), you can alter the `notification-service` to check if a `MATCH_FOUND` notification for that specific match percentage/user already exists before creating a new one in the database.

**Approach C: Remove the Notification Entirely**
Honestly, because the application already has a dedicated "Suggestions" feed on the Dashboard and the Matching page, notifying the user every time a match exists redundantly clutters the UI. You might only want notifications for *actions taken by others* (like receiving a Buddy Request or a Session Invite).

## 3. How to fix it right now?
Since it's highly annoying to have 80 duplicate notifications, the quickest and most architecturally sound fix for the current codebase is to **remove the side-effect from the query**.

I will go ahead and remove the `publishEvent` statement from the `getPotentialMatches` query in the code, which will instantly stop the notification spam on every page refresh!
