require('dotenv').config();
const { Kafka } = require('kafkajs');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const prisma = new PrismaClient();

// Raw pg pools for cross-DB lookups (user and matching service databases)
const userPool = new Pool({ connectionString: process.env.USER_SERVICE_DB_URL || process.env.DATABASE_URL });
const matchPool = new Pool({ connectionString: process.env.MATCH_SERVICE_DB_URL || process.env.DATABASE_URL });

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

// Check whether a MATCH_FOUND notification already exists between this userId and matchedUserId
async function matchNotifExists(userId, matchedUserId) {
  const existing = await prisma.notification.findFirst({
    where: { userId, type: 'MATCH_FOUND' }
  });
  if (!existing || !existing.metadata) return false;
  return existing.metadata.matchedUserId === matchedUserId;
}

// ─── Consumer ───────────────────────────────────────────────────────────────
async function startConsumer() {
  await consumer.connect();
  await consumer.subscribe({
    topics: [
      'UserPreferencesUpdated',   // Triggers MatchFound logic
      'StudySessionCreated',
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
      // 1. MatchFound — triggered by UserPreferencesUpdated
      //    Score updated user against ALL candidates. Notify pairs > 65%.
      //    Only once per pair (dedup via existing MATCH_FOUND notification).
      // ─────────────────────────────────────────────────────────────────
      if (topic === 'UserPreferencesUpdated') {
        const { userId } = payload;
        if (!userId) return;

        const allCandidates = await getAllMatchCandidates();
        const myProfile = allCandidates.find(c => c.userId === userId);
        if (!myProfile) return;

        const others = allCandidates.filter(c => c.userId !== userId);

        for (const candidate of others) {
          // Parse JSON availability if stored as string
          const me = {
            ...myProfile,
            availability: myProfile.availability
              ? (typeof myProfile.availability === 'string' ? JSON.parse(myProfile.availability) : myProfile.availability)
              : []
          };
          const them = {
            ...candidate,
            availability: candidate.availability
              ? (typeof candidate.availability === 'string' ? JSON.parse(candidate.availability) : candidate.availability)
              : []
          };

          const { score, commonCourses, commonTopics } = calculateScore(me, them);
          if (score <= 65) continue;

          const reason = `You share ${commonCourses.length} course(s) and ${commonTopics.length} topic(s) in common.`;

          // Notify the updated user about the candidate (if not already notified)
          const alreadyNotifiedMe = await matchNotifExists(userId, candidate.userId);
          if (!alreadyNotifiedMe) {
            const candidateName = await getUserName(candidate.userId);
            await prisma.notification.create({
              data: {
                userId,
                type: 'MATCH_FOUND',
                content: `New study buddy match! ${candidateName} has ${score}% compatibility with you.`,
                metadata: {
                  matchedUserId: candidate.userId,
                  matchedUserName: candidateName,
                  score,
                  commonCourses,
                  commonTopics,
                  reason
                }
              }
            });
            console.log(`[Notification] MATCH_FOUND → ${userId} about ${candidate.userId} (${score}%)`);
          }

          // Notify the candidate about the updated user (if not already notified)
          const alreadyNotifiedThem = await matchNotifExists(candidate.userId, userId);
          if (!alreadyNotifiedThem) {
            const myName = await getUserName(userId);
            await prisma.notification.create({
              data: {
                userId: candidate.userId,
                type: 'MATCH_FOUND',
                content: `New study buddy match! ${myName} has ${score}% compatibility with you.`,
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
            console.log(`[Notification] MATCH_FOUND → ${candidate.userId} about ${userId} (${score}%)`);
          }
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
      // 3. StudySessionJoined — 2 notifications: joiner + creator
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
