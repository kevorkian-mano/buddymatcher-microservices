require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  const candidates = await prisma.matchCandidate.findMany();
  console.log(`Matching DB has ${candidates.length} candidates in total.`);
  
  if (candidates.length === 0) return;

  const me = candidates[candidates.length - 1]; // Assume last added user is us
  console.log("Analyzing user ID:", me.userId);

  const others = candidates.filter(c => c.userId !== me.userId);
  console.log(`Found ${others.length} other candidates.`);
  
  let matches = 0;
  for (const c of others) {
    let score = 0;
    const commonCourses = me.courses.filter(course => c.courses.includes(course));
    const commonTopics = me.topics.filter(topic => c.topics.includes(topic));
    score += commonCourses.length * 12;
    score += commonTopics.length * 8;
    if (me.studyMode && c.studyMode && me.studyMode === c.studyMode) score += 7;
    if (me.studyPace && c.studyPace && me.studyPace === c.studyPace) score += 7;
    if (me.studyStyle && c.studyStyle && me.studyStyle === c.studyStyle) score += 7;
    
    if (score > 0) matches++;
  }
  console.log(`Matches with score > 0: ${matches}`);
  
  console.log("My profile courses:", me.courses);
  console.log("My profile topics:", me.topics);
  console.log("My preferences:", me.studyMode, me.studyPace, me.studyStyle);
}
test().catch(console.error).finally(() => prisma.$disconnect());
