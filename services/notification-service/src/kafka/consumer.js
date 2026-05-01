require('dotenv').config();
const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const prisma = new PrismaClient();

// Raw pg pools for cross-DB lookups (user and matching service databases)
const userPool    = new Pool({ connectionString: process.env.USER_SERVICE_DB_URL    || process.env.DATABASE_URL });
const matchPool   = new Pool({ connectionString: process.env.MATCH_SERVICE_DB_URL   || process.env.DATABASE_URL });
const sessionPool = new Pool({ connectionString: process.env.SESSION_SERVICE_DB_URL || process.env.DATABASE_URL });

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const consumer = kafka.consumer({ groupId: 'notification-group' });

// ─── Score calculator (mirrors matching-service logic) ──────────────────────
function calculateScore(me, candidate) {
  let score = 0;
  const commonCourses = (me.courses || []).filter(c => (candidate.courses || []).includes(c));
  const commonTopics  = (me.topics  || []).filter(t => (candidate.topics  || []).includes(t));

  score += commonCourses.length * 12;
  score += commonTopics.length  * 8;

  if (me.studyMode  && candidate.studyMode  && me.studyMode  === candidate.studyMode)  score += 7;
  if (me.studyPace  && candidate.studyPace  && me.studyPace  === candidate.studyPace)  score += 7;
  if (me.studyStyle && candidate.studyStyle && me.studyStyle === candidate.studyStyle) score += 7;

  if (
    me.availability && candidate.availability &&
    Array.isArray(me.availability) && Array.isArray(candidate.availability)
  ) {
    const myDays    = me.availability.map(s => s.dayOfWeek);
    const theirDays = candidate.availability.map(s => s.dayOfWeek);
    if (myDays.filter(d => theirDays.includes(d)).length > 0) score += 10;
  }

  return {
    score: Math.round(Math.min(score, 100)),
    commonCourses,
    commonTopics
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────
async function getUserName(userId) {
  try {
    const res = await userPool.query('SELECT name FROM "User" WHERE id = $1 LIMIT 1', [userId]);
    return res.rows[0]?.name || 'A user';
  } catch (e) {
    console.error('[Notification] getUserName error', e.message);
    return 'A user';
  }
}

async function getAllUserIdsExcept(excludeId) {
  try {
    const res = await userPool.query('SELECT id FROM "User" WHERE id != $1', [excludeId]);
    return res.rows.map(r => r.id);
  } catch (e) {
    console.error('[Notification] getAllUserIdsExcept error', e.message);
    return [];
  }
}

async function getAllMatchCandidates() {
  try {
    const res = await matchPool.query(
      'SELECT "userId", courses, topics, "studyPace", "studyMode", "studyStyle", availability FROM "MatchCandidate"'
    );
    return res.rows;
  } catch (e) {
    console.error('[Notification] getAllMatchCandidates error', e.message);
    return [];
  }
}


// ─── Per-user debounce for profile updates ───────────────────────────────────
// When "Save Profile" is clicked, the frontend fires N sequential mutations
// (updatePreferences, addTopic, removeTopic, addCourse, etc.), each emitting a
// UserPreferencesUpdated event.  We coalesce them into a single scoring run
// by waiting 4 seconds after the LAST event for a given userId.
const DEBOUNCE_MS = 4000;
const debounceTimers  = new Map(); // userId → setTimeout handle
const debouncePayload = new Map(); // userId → latest payload snapshot

// ─── Core matching logic — called once per debounced batch ──────────────────
async function processMatchNotifications(userId, latestPayload, eventTopic) {
  const { courses, topics: topicsPayload, preferences, slots } = latestPayload;

  // Build "me" from the payload (avoids race condition with matching-service DB)
  let meFromPayload = null;
  if (eventTopic === 'UserPreferencesUpdated' && (courses !== undefined || topicsPayload !== undefined)) {
    meFromPayload = {
      userId,
      courses:    courses       ? courses.map(c => c.name || c.id || c)       : [],
      topics:     topicsPayload ? topicsPayload.map(t => t.name || t.id || t) : [],
      studyPace:  preferences?.studyPace,
      studyMode:  preferences?.studyMode,
      studyStyle: preferences?.studyStyle,
    };
  }

  const allCandidates = await getAllMatchCandidates();

  const myDBProfile = allCandidates.find(c => c.userId === userId);
  if (!myDBProfile && !meFromPayload) {
    console.log(`[Notification] No profile data for userId=${userId}, skipping.`);
    return;
  }

  const meBase = myDBProfile || { userId, courses: [], topics: [], availability: [] };
  const meAvailability = eventTopic === 'AvailabilityUpdated' && slots
    ? slots
    : (meBase.availability
        ? (typeof meBase.availability === 'string' ? JSON.parse(meBase.availability) : meBase.availability)
        : []);

  const me = meFromPayload
    ? { ...meFromPayload, availability: meAvailability }
    : { ...meBase,        availability: meAvailability };

  const myName = await getUserName(userId);

  // Exclude ACCEPTED/connected users
  let connectedUserIds = new Set();
  try {
    const connRes = await matchPool.query(
      `SELECT "fromUser", "toUser" FROM "BuddyRequest"
       WHERE ("fromUser" = $1 OR "toUser" = $1) AND status = 'ACCEPTED'`,
      [userId]
    );
    connRes.rows.forEach(row => {
      connectedUserIds.add(row.fromUser === userId ? row.toUser : row.fromUser);
    });
  } catch (e) {
    console.error('[Notification] Failed to query BuddyRequest connections:', e.message);
  }

  const others = allCandidates.filter(c => c.userId !== userId && !connectedUserIds.has(c.userId));
  console.log(`[Notification] Scoring ${others.length} candidates for userId=${userId} (${connectedUserIds.size} connected excluded)`);

  for (const candidate of others) {
    const them = {
      ...candidate,
      availability: candidate.availability
        ? (typeof candidate.availability === 'string' ? JSON.parse(candidate.availability) : candidate.availability)
        : []
    };

    const { score, commonCourses, commonTopics } = calculateScore(me, them);

    if (score <= 65) {
      console.log(`[Notification] Score ${score}% ≤65 for ${candidate.userId} ← skip`);
      continue;
    }

    const reason = `You share ${commonCourses.length} course(s) and ${commonTopics.length} topic(s) in common.`;

    await prisma.notification.create({
      data: {
        userId: candidate.userId,
        type: 'MATCH_FOUND',
        content: `Study buddy match! ${myName} has ${score}% compatibility with you. ${reason}`,
        metadata: { matchedUserId: userId, matchedUserName: myName, score, commonCourses, commonTopics, reason }
      }
    });
    console.log(`[Notification] MATCH_FOUND → notified ${candidate.userId} about ${userId} (${score}%)`);
  }
}

// ─── Consumer ───────────────────────────────────────────────────────────────
async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topics: [
      'UserPreferencesUpdated',   // Triggers MatchFound logic (debounced)
      'AvailabilityUpdated',      // Triggers MatchFound logic (immediate — own save button)
      'StudySessionCreated',
      'StudySessionUpdated',
      'StudySessionJoined',
      'BuddyRequestCreated',
      'SessionInvitationReceived'
    ],
    fromBeginning: false
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      let event;
      try {
        event = JSON.parse(message.value.toString());
      } catch (e) {
        console.error('[Notification] Failed to parse Kafka message', e);
        return;
      }
      const { payload } = event;
      console.log(`[Notification] Received ${topic}`, payload);

      // ─────────────────────────────────────────────────────────────────
      // 1. MatchFound — UserPreferencesUpdated (debounced) or AvailabilityUpdated (immediate)
      //
      //    UserPreferencesUpdated fires once per mutation (addCourse, removeTopic, etc.)
      //    so a single "Save Profile" click can fire 5-10 events. We debounce them all
      //    into ONE scoring run 4 seconds after the last event for that userId.
      //
      //    AvailabilityUpdated fires once per availability save button click, so it is
      //    processed immediately without debouncing.
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'UserPreferencesUpdated') {
        const { userId } = payload;
        if (!userId) return;

        // Update the stored payload snapshot for this user (always keep the latest)
        debouncePayload.set(userId, payload);

        // Reset the timer — if another event arrives within DEBOUNCE_MS, restart the clock
        if (debounceTimers.has(userId)) {
          clearTimeout(debounceTimers.get(userId));
        }

        const timer = setTimeout(async () => {
          debounceTimers.delete(userId);
          const latestPayload = debouncePayload.get(userId);
          debouncePayload.delete(userId);
          console.log(`[Notification] Debounce settled for userId=${userId} — running match scoring`);
          try {
            await processMatchNotifications(userId, latestPayload, 'UserPreferencesUpdated');
          } catch (err) {
            console.error('[Notification] processMatchNotifications error:', err);
          }
        }, DEBOUNCE_MS);

        debounceTimers.set(userId, timer);
        console.log(`[Notification] Debounce reset for userId=${userId} (waiting ${DEBOUNCE_MS}ms)`);
        return; // Do not process now — wait for the debounce to settle
      }

      if (topic === 'AvailabilityUpdated') {
        const { userId } = payload;
        if (!userId) return;
        // Availability has its own save button → fires exactly one event → process immediately
        console.log(`[Notification] AvailabilityUpdated for userId=${userId} — running match scoring immediately`);
        await processMatchNotifications(userId, payload, 'AvailabilityUpdated');
      }

      // ─────────────────────────────────────────────────────────────────
      // 2. StudySessionCreated — broadcast to ALL users except creator
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'StudySessionCreated') {
        const { sessionId, creatorId, topic: sessionTitle } = payload;
        if (!sessionId || !creatorId) return;

        const creatorName = await getUserName(creatorId);
        const allUserIds  = await getAllUserIdsExcept(creatorId);

        for (const uid of allUserIds) {
          await prisma.notification.create({
            data: {
              userId: uid,
              type: 'SESSION_CREATED',
              content: `${creatorName} created a new study session: "${sessionTitle}".`,
              metadata: { sessionId, sessionTitle, creatorId, creatorName }
            }
          });
        }
        console.log(`[Notification] SESSION_CREATED broadcast to ${allUserIds.length} users`);
      }

      // ─────────────────────────────────────────────────────────────────
      // 3. StudySessionUpdated — notify joined participants (not creator)
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'StudySessionUpdated') {
        const { sessionId, creatorId, topic: sessionTitle } = payload;
        if (!sessionId || !creatorId) return;

        let participantIds = [];
        try {
          const res = await sessionPool.query(
            'SELECT "userId" FROM "SessionParticipant" WHERE "sessionId" = $1 AND "userId" != $2',
            [sessionId, creatorId]
          );
          participantIds = res.rows.map(r => r.userId);
        } catch (e) {
          console.error('[Notification] Failed to query SessionParticipant:', e.message);
        }

        const creatorName = await getUserName(creatorId);
        const title       = sessionTitle || 'a study session';

        for (const uid of participantIds) {
          await prisma.notification.create({
            data: {
              userId: uid,
              type: 'SESSION_UPDATED',
              content: `${creatorName} updated the session: "${title}". Check the latest details.`,
              metadata: { sessionId, sessionTitle: title, creatorId, creatorName }
            }
          });
        }
        console.log(`[Notification] SESSION_UPDATED: notified ${participantIds.length} participant(s) for session ${sessionId}`);
      }

      // ─────────────────────────────────────────────────────────────────
      // 4. StudySessionJoined — 2 notifications: joiner + creator
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'StudySessionJoined') {
        const { sessionId, userId: joinerId, creatorId, topic: sessionTitle } = payload;
        if (!sessionId || !joinerId) return;

        const joinerName = await getUserName(joinerId);
        const title      = sessionTitle || 'a study session';

        // Notify the joiner
        await prisma.notification.create({
          data: {
            userId: joinerId,
            type: 'SESSION_JOINED',
            content: `You successfully joined the session: "${title}".`,
            metadata: { sessionId, sessionTitle: title, role: 'joiner', creatorId }
          }
        });

        // Notify the creator (only if different from joiner)
        if (creatorId && creatorId !== joinerId) {
          await prisma.notification.create({
            data: {
              userId: creatorId,
              type: 'SESSION_JOINED',
              content: `${joinerName} joined your session: "${title}".`,
              metadata: { sessionId, sessionTitle: title, role: 'creator', joinerId, joinerName }
            }
          });
        }
        console.log(`[Notification] SESSION_JOINED: notified joiner ${joinerId} + creator ${creatorId}`);
      }

      // ─────────────────────────────────────────────────────────────────
      // 4. BuddyRequestCreated — notify recipient with sender's name
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'BuddyRequestCreated') {
        const { fromUser, toUser, requestId } = payload;
        if (!toUser) return;

        const fromUserName = await getUserName(fromUser);
        await prisma.notification.create({
          data: {
            userId: toUser,
            type: 'BUDDY_REQUEST',
            content: `${fromUserName} sent you a buddy request!`,
            metadata: { fromUserId: fromUser, fromUserName, requestId }
          }
        });
        console.log(`[Notification] BUDDY_REQUEST: notified ${toUser} from ${fromUser}`);
      }

      // ─────────────────────────────────────────────────────────────────
      // 5. SessionInvitationReceived — notify invited user with enriched data
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'SessionInvitationReceived') {
        const { sessionId, toUser, fromUser, topic: sessionTitle } = payload;
        if (!toUser) return;

        const fromUserName = await getUserName(fromUser);
        const title        = sessionTitle || 'a study session';

        await prisma.notification.create({
          data: {
            userId: toUser,
            type: 'SESSION_INVITATION',
            content: `${fromUserName} invited you to join "${title}".`,
            metadata: { sessionId, sessionTitle: title, fromUserId: fromUser, fromUserName }
          }
        });
        console.log(`[Notification] SESSION_INVITATION: notified ${toUser} from ${fromUser}`);
      }
    }
  });
}

module.exports = { startConsumer };
