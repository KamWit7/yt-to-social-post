import { prisma } from '@/lib/prisma'
import { Session } from '@prisma/client'

// Session Management Operations
export async function createSession(data: {
  sessionToken: string
  userId: string
  expires: Date
}): Promise<Session> {
  return await prisma.session.create({
    data,
  })
}

export async function findSession(
  sessionToken: string
): Promise<Session | null> {
  return await prisma.session.findUnique({
    where: { sessionToken },
    include: {
      user: true,
    },
  })
}

export async function updateSession(
  sessionToken: string,
  data: Partial<Pick<Session, 'expires'>>
): Promise<Session> {
  return await prisma.session.update({
    where: { sessionToken },
    data,
  })
}

export async function deleteSession(sessionToken: string): Promise<Session> {
  return await prisma.session.delete({
    where: { sessionToken },
  })
}

export async function cleanupExpiredSessions(): Promise<{ count: number }> {
  const result = await prisma.session.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  })

  return result
}
