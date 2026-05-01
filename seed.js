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

// Create 5 users with very similar profiles (Group A)
const groupA_Users = [
  { id: crypto.randomUUID(), name: "Alice Adams 1", email: "alice@stanford2.edu", passwordHash: hash("pass"), university: "Stanford University2", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Bob Barker 2", email: "bob@stanford2.edu", passwordHash: hash("pass"), university: "Stanford University2", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Charlie Chaplin 2", email: "charlie@stanford2.edu", passwordHash: hash("pass"), university: "Stanford University2", major: "Computer Science", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Diana Prince 2", email: "diana@stanford2.edu", passwordHash: hash("pass"), university: "Stanford University2", major: "Software Engineering", academicYear: "Junior" },
  { id: crypto.randomUUID(), name: "Eve Polastri 2", email: "eve@stanford2.edu", passwordHash: hash("pass"), university: "Stanford University2", major: "Computer Science", academicYear: "Senior" }
];

// All 5 have same courses, topics, preferences, and availability - should be a perfect match cluster
const groupA_Profiles = groupA_Users.map((u, i) => ({
  userId: u.id,
  courses: [
    { name: "Data Structures", code: "CS201" },
    { name: "Operating Systems", code: "CS301" }
  ],
  topics: [{ name: "Graphs" }, { name: "Trees" }, { name: "Sorting" }],
  preferences: { studyPace: "Fast", studyMode: "In-person", groupSize: "Small Group", studyStyle: "reading" },
  availability: [
    { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" }, 
    { dayOfWeek: 3, startTime: "18:00", endTime: "20:00" }  
  ]
}));

groupA_Profiles[4].preferences.studyStyle = "handson"; 
groupA_Profiles[4].availability.push({ dayOfWeek: 2, startTime: "12:00", endTime: "14:00" }); 


// Create 7 users with partially overlapping profiles (Group B)
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
  preferences: { studyPace: "Moderate", studyMode: "Online", groupSize: "Large Group", studyStyle: "visual" },
  availability: [
    { dayOfWeek: 1, startTime: "19:00", endTime: "21:00" }, 
    { dayOfWeek: 4, startTime: "14:00", endTime: "16:00" }  
  ]
}));


// Create 8 users with very different profiles (Group C)
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
  preferences: { studyPace: "Slow", studyMode: "Both", groupSize: "Small Group", studyStyle: "auditory" },
  availability: [
    { dayOfWeek: 2, startTime: "08:00", endTime: "10:00" }, 
    { dayOfWeek: 5, startTime: "08:00", endTime: "10:00" }  
  ]
}));




const randomPaces = ["Fast", "Moderate", "Slow"];
const randomModes = ["Online", "In-person", "Both"];
const randomSizes = ["Small Group", "Large Group"];
const randomStyles = ["visual", "auditory", "reading", "handson"];
const possibleCourses = [
  { name: "Data Structures", code: "CS201" },
  { name: "Operating Systems", code: "CS301" },
  { name: "Artificial Intelligence", code: "CS501" },
  { name: "Databases", code: "CS401" },
  { name: "Machine Learning", code: "CS502" },
  { name: "Calculus", code: "MATH101" },
  { name: "Physics", code: "PHY101" },
  { name: "Linear Algebra", code: "MATH201" }
];
const possibleTopics = ["Graphs", "Trees", "Sorting", "Neural Networks", "SQL", "Derivatives", "Kinematics", "React", "NodeJS", "Dynamic Programming"];

const random_Users = Array.from({ length: 40 }, (_, i) => ({
  id: crypto.randomUUID(),
  name: `Random Student ${i + 1}`,
  email: `student${i + 40}@college.edu`,
  passwordHash: hash("pass"),
  university: "Global University", major: "Computer Science", academicYear: "Sophomore"
}));

const random_Profiles = random_Users.map((u, i) => {
  // pick 1-4 random courses
  const myCourses = possibleCourses.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 4) + 1);
  // pick 1-5 random topics
  const myTopics = possibleTopics.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 5) + 1).map(t => ({ name: t }));
  
  return {
    userId: u.id,
    courses: myCourses,
    topics: myTopics,
    preferences: { 
      studyPace: randomPaces[Math.floor(Math.random() * randomPaces.length)], 
      studyMode: randomModes[Math.floor(Math.random() * randomModes.length)], 
      groupSize: randomSizes[Math.floor(Math.random() * randomSizes.length)], 
      studyStyle: randomStyles[Math.floor(Math.random() * randomStyles.length)] 
    },
    availability: [
      { dayOfWeek: Math.floor(Math.random() * 7), startTime: "10:00", endTime: "12:00" },
      { dayOfWeek: Math.floor(Math.random() * 7), startTime: "14:00", endTime: "16:00" }
    ]
  };
});

const ALL_USERS = [
  groupA_Users[0],
   groupA_Users[1],
   groupA_Users[2],
   groupA_Users[3],

];

const ALL_PROFILES = [
  groupA_Profiles[0],
  groupB_Profiles[0],
  groupC_Profiles[0],
  random_Profiles[0],
  random_Profiles[1]
];

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
