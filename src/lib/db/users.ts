import { prisma } from '@/lib/prisma'
import { User, UserUsage } from '@prisma/client'
import bcrypt from 'bcryptjs'

type UserWithUsage = User & {
  usage?: UserUsage | null
  password?: string | null
}

// User Management Operations
export async function createUser(data: {
  email: string
  name?: string
  image?: string
  password?: string
}): Promise<User> {
  const { password, ...userData } = data
  const hashedPassword = password ? await bcrypt.hash(password, 12) : undefined

  const user = await prisma.user.create({
    data: {
      ...userData,

      password: hashedPassword,
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

  return user
}

export async function findUserByEmail(
  email: string
): Promise<UserWithUsage | null> {
  return await prisma.user.findUnique({
    where: { email },
    include: {
      usage: true,
    },
  })
}
