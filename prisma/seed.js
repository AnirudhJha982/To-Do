const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.upsert({
    where: { email: 'test@liferpg.com' },
    update: {},
    create: {
      email: 'test@liferpg.com',
      name: 'Test Hero',
      passwordHash: passwordHash,
      character: {
        create: {
          name: 'Hero of Time',
          avatar: '🧙‍♂️',
          level: 12,
          xp: 1240,
          gold: 850,
          strength: 58,
          intellect: 72,
          vitality: 60,
          creativity: 40,
          discipline: 81,
          currentStreak: 7,
          longestStreak: 12,
        }
      }
    }
  });

  console.log({ user });
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
