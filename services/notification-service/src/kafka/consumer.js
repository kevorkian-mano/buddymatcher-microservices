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


// ─── Consumer ───────────────────────────────────────────────────────────────
async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topics: [
      'UserPreferencesUpdated',   // Triggers MatchFound logic
      'AvailabilityUpdated',      // Also triggers MatchFound logic
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
      // 1. MatchFound — triggered by UserPreferencesUpdated or AvailabilityUpdated
      //
      //    CORRECT LOGIC:
      //    - The user who changed their profile (userId) does NOT receive any notification.
      //    - Users who are already ACCEPTED/connected to userId are also excluded.
      //    - For every OTHER non-connected candidate:
      //        * Calculate score. Use the INCOMING payload to avoid race conditions
      //          (matching-service DB may not yet be updated).
      //        * If score > 65%: notify the CANDIDATE.
      //        * If score <= 65%: skip.
      //    - Dedup: skip if this candidate has already been notified about userId
      //      (prevents repeated pings for the same high-score pair).
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'UserPreferencesUpdated' || topic === 'AvailabilityUpdated') {
        const { userId, courses, topics: topicsPayload, preferences, slots } = payload;
        if (!userId) return;

        // ── Build "me" from the PAYLOAD (not DB) to avoid the race condition ──
        // For AvailabilityUpdated, courses/topics come from DB later; only slots change.
        // For UserPreferencesUpdated, courses/topics/prefs come directly in payload.
        let meFromPayload = null;
        if (topic === 'UserPreferencesUpdated' && (courses !== undefined || topicsPayload !== undefined)) {
          meFromPayload = {
            userId,
            courses: courses ? courses.map(c => c.name || c.id || c) : [],
            topics:  topicsPayload ? topicsPayload.map(t => t.name || t.id || t) : [],
            studyPace:  preferences?.studyPace,
            studyMode:  preferences?.studyMode,
            studyStyle: preferences?.studyStyle,
          };
        }

        // ── Fetch all MatchCandidates for score calculation ──
        const allCandidates = await getAllMatchCandidates();

        // Resolve "me" — prefer payload data, fall back to DB
        const myDBProfile = allCandidates.find(c => c.userId === userId);
        if (!myDBProfile && !meFromPayload) {
          console.log(`[Notification] No profile data for userId=${userId}, skipping.`);
          return;
        }

        const meBase = myDBProfile || { userId, courses: [], topics: [], availability: [] };
        const meAvailability = topic === 'AvailabilityUpdated' && slots
          ? slots
          : (meBase.availability
              ? (typeof meBase.availability === 'string' ? JSON.parse(meBase.availability) : meBase.availability)
              : []);

        const me = meFromPayload
          ? { ...meFromPayload, availability: meAvailability }
          : { ...meBase,        availability: meAvailability };

        const myName = await getUserName(userId);

        // ── Fetch ACCEPTED connections for userId — exclude them ──
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

        // ── Score every non-connected other user and notify if > 65% ──
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

          // Always notify — score may have changed since the last notification
          const reason = `You share ${commonCourses.length} course(s) and ${commonTopics.length} topic(s) in common.`;

          await prisma.notification.create({
            data: {
              userId: candidate.userId,    // recipient is the OTHER user
              type: 'MATCH_FOUND',
              content: `Study buddy match! ${myName} has ${score}% compatibility with you. ${reason}`,
              metadata: {
                matchedUserId: userId,
                matchedUserName: myName,
                score,
                commonCourses,
                commonTopics,
                reason
              }
            }
          });
          console.log(`[Notification] MATCH_FOUND → notified ${candidate.userId} about ${userId} (${score}%)`);
        }
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
