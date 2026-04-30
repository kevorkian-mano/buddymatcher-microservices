const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testResolver(userId) {
  const myProfile = await prisma.matchCandidate.findUnique({ where: { userId } });
  console.log("myProfile found?", !!myProfile);
  if (!myProfile) return;

  const excludedUserIds = [userId];
  const candidates = await prisma.matchCandidate.findMany({
    where: { userId: { notIn: excludedUserIds } }
  });
  console.log("candidates fetched:", candidates.length);
}
testResolver('1f77c505-9466-450f-ace7-519324630eae').finally(() => prisma.$disconnect());
