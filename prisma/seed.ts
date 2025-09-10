import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Clean up existing users first
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['demo@example.com', 'test@example.com'],
      },
    },
  })

  // Create demo user
  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: await bcrypt.hash('password', 12),
      emailVerified: new Date(),
      usage: {
        create: {
          summaryCount: 2, // Start with some usage
        },
      },
    },
    include: {
      usage: true,
    },
  })

  console.log('Created demo user:', demoUser)

  // Create demo user
  const demoUser2 = await prisma.user.create({
    data: {
      email: 'demo2@example.com',
      name: 'Demo User',
      password: await bcrypt.hash('password', 12),
      emailVerified: new Date(),
      usage: {
        create: {
          summaryCount: 10, // Start with some usage
        },
      },
    },
    include: {
      usage: true,
    },
  })

  console.log('Created demo user 2:', demoUser2)

  // Create a test user for Google OAuth simulation
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
      image: 'https://via.placeholder.com/150',
      usage: {
        create: {
          summaryCount: 0,
        },
      },
    },
    include: {
      usage: true,
    },
  })

  console.log('Created test user:', testUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
