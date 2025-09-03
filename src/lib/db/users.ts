import { prisma } from '@/lib/prisma'
import { User, UserUsage } from '@prisma/client'
import bcrypt from 'bcryptjs'

export type UserWithUsage = User & {
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

export async function findUserById(id: string): Promise<UserWithUsage | null> {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      usage: true,
    },
  })
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

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'name' | 'email' | 'image' | 'emailVerified'>>
): Promise<User> {
  return await prisma.user.update({
    where: { id },
    data,
  })
}

export async function deleteUser(id: string): Promise<User> {
  return await prisma.user.delete({
    where: { id },
  })
}

export async function getUserCount(): Promise<number> {
  return await prisma.user.count()
}
