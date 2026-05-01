const { Client } = require('pg');
const crypto = require('crypto');
const { Kafka } = require('kafkajs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Database URLs
const DATABASE_URL_USER = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/user_db?sslmode=require";
const DATABASE_URL_PROFILE = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/profile_db?sslmode=require";
const DATABASE_URL_AVAILABILITY = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/availability_db?sslmode=require";
const DATABASE_URL_MATCHING = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/matching_db?sslmode=require";
const DATABASE_URL_SESSION = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/session_db?sslmode=require";
const DATABASE_URL_NOTIFICATION = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/notification_db?sslmode=require";

// Use a REAL bcrypt hash for the password "pass" so login succeeds
const hash = (pwd) => pwd === "pass" ? "$2a$10$UwewS3G1TVx3soRfwhrXpu7It53vBHGwj7NujWUJ.EKV3CQz5jYxC" : "unknown"; 

const aliceId = crypto.randomUUID();
const bobId = crypto.randomUUID();

const aliceAndBobUsers = [
  { id: aliceId, name: "Alice Adams", email: "alice@example.com", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Junior" },
  { id: bobId, name: "Bob Builder", email: "bob@example.com", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Junior" }
];

const aliceAndBobProfiles = aliceAndBobUsers.map(u => ({
  userId: u.id,
  courses: [
    { name: "Data Structures", code: "CS201" },
    { name: "Operating Systems", code: "CS301" },
    { name: "Databases", code: "CS401" },
    { name: "Algorithms", code: "CS402" }
  ],
  topics: [{ name: "Graphs" }, { name: "Trees" }, { name: "Sorting" }, { name: "SQL" }],
  preferences: { studyPace: "Moderate", studyMode: "In-person", groupSize: "Small Group", studyStyle: "visual" },
  availability: [
    { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }, 
    { dayOfWeek: 3, startTime: "18:00", endTime: "20:00" }  
  ]
}));

// We need 20 other users in clusters.
const firstNames = ["Charlie", "Diana", "Eve", "Frank", "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Niaj", "Oscar", "Peggy", "Romeo", "Sybil", "Trent", "Victor", "Walter", "Xavier", "Yvonne", "Zelda"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];

const clusteredUsers = [];
const clusteredProfiles = [];

for (let i = 0; i < 20; i++) {
  const id = crypto.randomUUID();
  clusteredUsers.push({
    id,
    name: `${firstNames[i]} ${lastNames[i]}`,
    email: `user${i}@example.com`,
    passwordHash: hash("pass"),
    university: "Stanford University",
    major: "Computer Science",
    academicYear: "Sophomore"
  });

  let profile = { userId: id, courses: [], topics: [], preferences: {}, availability: [] };

  if (i < 5) {
    // Cluster 1 (High Match - Score ~91 with Alice/Bob)
    profile.courses = [{ name: "Data Structures", code: "CS201" }, { name: "Operating Systems", code: "CS301" }, { name: "Databases", code: "CS401" }];
    profile.topics = [{ name: "Graphs" }, { name: "Trees" }, { name: "Sorting" }];
    profile.preferences = { studyPace: "Moderate", studyMode: "In-person", groupSize: "Large Group", studyStyle: "visual" };
    profile.availability = [{ dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }];
  } else if (i < 12) {
    // Cluster 2 (Medium Match - Score ~72 with Alice/Bob)
    profile.courses = [{ name: "Data Structures", code: "CS201" }, { name: "Operating Systems", code: "CS301" }];
    profile.topics = [{ name: "Graphs" }, { name: "Trees" }, { name: "SQL" }];
    profile.preferences = { studyPace: "Moderate", studyMode: "Online", groupSize: "Small Group", studyStyle: "visual" };
    profile.availability = [{ dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }];
  } else if (i < 18) {
    // Cluster 3 (Borderline Match - Score ~66 with Alice/Bob)
    profile.courses = [{ name: "Data Structures", code: "CS201" }, { name: "Operating Systems", code: "CS301" }, { name: "Algorithms", code: "CS402" }];
    profile.topics = [{ name: "Graphs" }, { name: "SQL" }];
    profile.preferences = { studyPace: "Moderate", studyMode: "In-person", groupSize: "Solo", studyStyle: "auditory" };
    profile.availability = [{ dayOfWeek: 2, startTime: "10:00", endTime: "12:00" }];
  } else {
    // Cluster 4 (Low Match < 65 - Score ~20 with Alice/Bob) - exactly 2 users
    profile.courses = [{ name: "Data Structures", code: "CS201" }];
    profile.topics = [{ name: "Graphs" }];
    profile.preferences = { studyPace: "Slow", studyMode: "Online", groupSize: "Solo", studyStyle: "auditory" };
    profile.availability = [{ dayOfWeek: 2, startTime: "10:00", endTime: "12:00" }];
  }
  clusteredProfiles.push(profile);
}

const ALL_USERS = [...aliceAndBobUsers, ...clusteredUsers];
const ALL_PROFILES = [...aliceAndBobProfiles, ...clusteredProfiles];

async function clearTable(client, table) {
  try {
    await client.query(`DELETE FROM "${table}";`);
    console.log(`Cleared table ${table}`);
  } catch (err) {
    console.error(`Error clearing ${table}:`, err.message);
  }
}

async function clearDatabases() {
  console.log('Clearing databases...');
  
  const userClient = new Client({ connectionString: DATABASE_URL_USER });
  await userClient.connect();
  await clearTable(userClient, "User");
  await userClient.end();

  const profileClient = new Client({ connectionString: DATABASE_URL_PROFILE });
  await profileClient.connect();
  await clearTable(profileClient, "Course");
  await clearTable(profileClient, "Topic");
  await clearTable(profileClient, "StudyGoal");
  await clearTable(profileClient, "Preferences");
  await clearTable(profileClient, "Profile");
  await profileClient.end();

  const availabilityClient = new Client({ connectionString: DATABASE_URL_AVAILABILITY });
  await availabilityClient.connect();
  await clearTable(availabilityClient, "AvailabilitySlot");
  await clearTable(availabilityClient, "FreeDay");
  await availabilityClient.end();

  const matchingClient = new Client({ connectionString: DATABASE_URL_MATCHING });
  await matchingClient.connect();
  await clearTable(matchingClient, "BuddyRequest");
  await clearTable(matchingClient, "MatchCandidate");
  await matchingClient.end();

  const sessionClient = new Client({ connectionString: DATABASE_URL_SESSION });
  await sessionClient.connect();
  await clearTable(sessionClient, "StudySessionParticipant");
  await clearTable(sessionClient, "StudySession");
  await sessionClient.end();

  const notificationClient = new Client({ connectionString: DATABASE_URL_NOTIFICATION });
  await notificationClient.connect();
  await clearTable(notificationClient, "Notification");
  await notificationClient.end();
}

async function seedUserDb() {
  const client = new Client({ connectionString: DATABASE_URL_USER });
  await client.connect();
  for (const user of ALL_USERS) {
    await client.query(`
      INSERT INTO "User" (id, name, email, "passwordHash", university, major, "academicYear", "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET "passwordHash" = EXCLUDED."passwordHash"
    `, [user.id, user.name, user.email, user.passwordHash, user.university, user.major, user.academicYear]);
  }
  await client.end();
}

async function seedProfileDb() {
  const client = new Client({ connectionString: DATABASE_URL_PROFILE });
  await client.connect();
  for (const profileData of ALL_PROFILES) {
    const profileId = crypto.randomUUID();
    await client.query(`
      INSERT INTO "Profile" (id, "userId", "createdAt", "updatedAt") 
      VALUES ($1, $2, NOW(), NOW())
      ON CONFLICT ("userId") DO NOTHING
    `, [profileId, profileData.userId]);
    
    const res = await client.query('SELECT id FROM "Profile" WHERE "userId" = $1', [profileData.userId]);
    if(res.rows.length === 0) continue;
    const realProfileId = res.rows[0].id;
    
    await client.query(`
      INSERT INTO "Preferences" (id, "profileId", "studyPace", "studyMode", "groupSize", "studyStyle") 
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT ("profileId") DO NOTHING
    `, [crypto.randomUUID(), realProfileId, profileData.preferences.studyPace, profileData.preferences.studyMode, profileData.preferences.groupSize, profileData.preferences.studyStyle]);

    for (const c of profileData.courses) {
      await client.query(`INSERT INTO "Course" (id, name, code, "profileId") VALUES ($1, $2, $3, $4)`, [crypto.randomUUID(), c.name, c.code, realProfileId]);
    }
    for (const t of profileData.topics) {
      await client.query(`INSERT INTO "Topic" (id, name, "profileId") VALUES ($1, $2, $3)`, [crypto.randomUUID(), t.name, realProfileId]);
    }
  }
  await client.end();
}

async function seedAvailabilityDb() {
  const client = new Client({ connectionString: DATABASE_URL_AVAILABILITY });
  await client.connect();
  for (const profileData of ALL_PROFILES) {
    for (const slot of profileData.availability) {
      await client.query(`
        INSERT INTO "AvailabilitySlot" (id, "userId", "dayOfWeek", "startTime", "endTime", "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
        ON CONFLICT ("userId", "dayOfWeek", "startTime") DO NOTHING
      `, [crypto.randomUUID(), profileData.userId, slot.dayOfWeek, slot.startTime, slot.endTime]);
    }
  }
  await client.end();
}

async function seedMatchingDb() {
  const client = new Client({ connectionString: DATABASE_URL_MATCHING });
  await client.connect();
  for (const profileData of ALL_PROFILES) {
    const courseNames = profileData.courses.map(c => c.name);
    const topicNames = profileData.topics.map(t => t.name);
    const availabilityJson = JSON.stringify(profileData.availability);
    
    await client.query(`
      INSERT INTO "MatchCandidate" (id, "userId", courses, topics, "studyPace", "studyMode", "studyStyle", availability, "updatedAt") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      ON CONFLICT ("userId") DO UPDATE SET 
        courses = EXCLUDED.courses,
        topics = EXCLUDED.topics,
        "studyPace" = EXCLUDED."studyPace",
        "studyMode" = EXCLUDED."studyMode",
        "studyStyle" = EXCLUDED."studyStyle",
        availability = EXCLUDED.availability,
        "updatedAt" = EXCLUDED."updatedAt"
    `, [
      crypto.randomUUID(), 
      profileData.userId, 
      courseNames, 
      topicNames, 
      profileData.preferences.studyPace, 
      profileData.preferences.studyMode, 
      profileData.preferences.studyStyle, 
      availabilityJson
    ]);
  }
  await client.end();
}

async function triggerMatchingEvents() {
  console.log('Publishing UserPreferencesUpdated events to trigger matching/notification logic...');
  const kafka = new Kafka({ clientId: 'seed-producer', brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] });
  const producer = kafka.producer();
  await producer.connect();

  for (const profileData of ALL_PROFILES) {
    const msg = {
      event: 'UserPreferencesUpdated',
      timestamp: new Date().toISOString(),
      producer: 'seed-script',
      correlationId: uuidv4(),
      payload: {
        userId: profileData.userId,
        courses: profileData.courses.map(c => ({ name: c.name })),
        topics:  profileData.topics.map(t => ({ name: t.name })),
        preferences: profileData.preferences ? {
          studyPace:  profileData.preferences.studyPace,
          studyMode:  profileData.preferences.studyMode,
          studyStyle: profileData.preferences.studyStyle
        } : null
      }
    };
    
    await producer.send({ topic: 'UserPreferencesUpdated', messages: [{ value: JSON.stringify(msg) }] });
    await new Promise(r => setTimeout(r, 100)); // slight delay
  }

  await producer.disconnect();
  console.log('Events published.');
}

async function run() {
  try {
    await clearDatabases();
    console.log('---');
    await seedUserDb();
    console.log('User DB Seeded.');
    await seedProfileDb();
    console.log('Profile DB Seeded.');
    await seedAvailabilityDb();
    console.log('Availability DB Seeded.');
    await seedMatchingDb();
    console.log('Matching DB Seeded.');
    await triggerMatchingEvents();
    console.log('All done! You can now login as alice@example.com or bob@example.com with password "pass".');
  } catch (err) {
    console.error('Migration failed', err);
  }
}

run();
