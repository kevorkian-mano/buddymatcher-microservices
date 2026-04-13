const { Client } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

// Database URLs
const DATABASE_URL_USER = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/user_db?sslmode=require";
const DATABASE_URL_PROFILE = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/profile_db?sslmode=require";
const DATABASE_URL_AVAILABILITY = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/availability_db?sslmode=require";
const DATABASE_URL_MATCHING = "postgresql://neondb_owner:npg_pElvhXLJ0S7Y@ep-shy-mouse-adic3083.c-2.us-east-1.aws.neon.tech/matching_db?sslmode=require";

// Use a REAL bcrypt hash for the password "pass" so login succeeds
const hash = (pwd) => pwd === "pass" ? "$2a$10$UwewS3G1TVx3soRfwhrXpu7It53vBHGwj7NujWUJ.EKV3CQz5jYxC" : "unknown"; 

const groupA_Users = [
  { id: crypto.randomUUID(), name: "Alice Adams", email: "alice@stanford.edu", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Bob Barker", email: "bob@stanford.edu", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Charlie Chaplin", email: "charlie@stanford.edu", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Diana Prince", email: "diana@stanford.edu", passwordHash: hash("pass"), university: "Stanford University", major: "Software Engineering", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Eve Polastri", email: "eve@stanford.edu", passwordHash: hash("pass"), university: "Stanford University", major: "Computer Science", academicYear: "Senior" }
];

const groupA_Profiles = groupA_Users.map((u, i) => ({
  userId: u.id,
  courses: [
    { name: "Data Structures", code: "CS201" },
    { name: "Operating Systems", code: "CS301" }
  ],
  topics: [{ name: "Graphs" }, { name: "Trees" }, { name: "Sorting" }],
  preferences: { studyPace: "fast", studyMode: "in-person", groupSize: "small", studyStyle: "discussion" },
  availability: [
    { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }, 
    { dayOfWeek: 3, startTime: "18:00", endTime: "20:00" }  
  ]
}));

groupA_Profiles[4].preferences.studyStyle = "notes"; 
groupA_Profiles[4].availability.push({ dayOfWeek: 2, startTime: "12:00", endTime: "14:00" }); 

const groupB_Users = Array.from({ length: 7 }, (_, i) => ({
  id: crypto.randomUUID(),
  name: `Partial Matcher ${i + 6}`,
  email: `partial${i + 6}@mit.edu`,
  passwordHash: hash("pass"),
  university: "MIT", major: "Computer Science", academicYear: "Sophomore"
}));

const groupB_Profiles = groupB_Users.map((u, i) => ({
  userId: u.id,
  courses: [
    { name: "Data Structures", code: "CS201" }, 
    { name: "Artificial Intelligence", code: "CS501" },
    { name: "Databases", code: "CS401" }
  ],
  topics: [{ name: "Trees" }, { name: "Neural Networks" }, { name: "SQL" }], 
  preferences: { studyPace: "moderate", studyMode: "online", groupSize: "large", studyStyle: "notes" },
  availability: [
    { dayOfWeek: 1, startTime: "19:00", endTime: "21:00" }, 
    { dayOfWeek: 4, startTime: "14:00", endTime: "16:00" }  
  ]
}));

const groupC_Users = Array.from({ length: 8 }, (_, i) => ({
  id: crypto.randomUUID(),
  name: `History Buff ${i + 13}`,
  email: `history${i + 13}@ucberkeley.edu`,
  passwordHash: hash("pass"),
  university: "UC Berkeley", major: "History", academicYear: "Senior"
}));

const groupC_Profiles = groupC_Users.map((u, i) => ({
  userId: u.id,
  courses: [
    { name: "European History", code: "HIST101" },
    { name: "Art of the Renaissance", code: "ART202" }
  ],
  topics: [{ name: "The Medici Family" }, { name: "Painting techniques" }, { name: "Poetry" }],
  preferences: { studyPace: "slow", studyMode: "in-person", groupSize: "solo", studyStyle: "quiet" },
  availability: [
    { dayOfWeek: 2, startTime: "08:00", endTime: "10:00" }, 
    { dayOfWeek: 5, startTime: "08:00", endTime: "10:00" }  
  ]
}));

const ALL_USERS = [...groupA_Users, ...groupB_Users, ...groupC_Users];
const ALL_PROFILES = [...groupA_Profiles, ...groupB_Profiles, ...groupC_Profiles];

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

async function run() {
  try {
    await seedUserDb();
    console.log('User DB Seeded.');
    await seedProfileDb();
    console.log('Profile DB Seeded.');
    await seedAvailabilityDb();
    console.log('Availability DB Seeded.');
    await seedMatchingDb();
    console.log('Matching DB Seeded.');
    console.log('All done!');
  } catch (err) {
    console.error('Migration failed', err);
  }
}

run();
