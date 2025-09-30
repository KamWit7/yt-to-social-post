import { prisma } from '@/lib/prisma'
import { AccountTier, UserUsage } from '@prisma/client'

// Usage Tracking Operations
export async function createUserUsage(userId: string): Promise<UserUsage> {
  return await prisma.userUsage.create({
    data: {
      userId,
      summaryCount: 0,
    },
  })
}

export async function getUserUsage(userId: string): Promise<UserUsage | null> {
  return await prisma.userUsage.findUnique({
    where: { userId },
  })
}

export async function incrementUsage(userId: string): Promise<UserUsage> {
  // First, try to increment existing usage
  try {
    return await prisma.userUsage.update({
      where: { userId },
      data: {
        summaryCount: {
          increment: 1,
        },
        lastUsed: new Date(),
      },
    })
  } catch {
    // If user usage doesn't exist, create it first
    await createUserUsage(userId)
    return await prisma.userUsage.update({
      where: { userId },
      data: {
        summaryCount: 1,
        lastUsed: new Date(),
      },
    })
  }
}

export async function checkUsageLimit(
  userId: string,
  limit: number = 10
): Promise<{
  withinLimit: boolean
  currentUsage: number
  limit: number
}> {
  const usage = await getUserUsage(userId)
  console.log('usage', usage?.accountTier)
  const currentUsage = usage?.summaryCount || 0

  const tierLimit = usage?.accountTier === AccountTier.BYOK ? Infinity : limit

  const isWithinLimit =
    usage?.accountTier === AccountTier.BYOK ? true : currentUsage < tierLimit

  return {
    withinLimit: isWithinLimit,
    currentUsage,
    limit: tierLimit,
  }
}

export async function resetUsage(userId: string): Promise<UserUsage> {
  return await prisma.userUsage.update({
    where: { userId },
    data: {
      summaryCount: 0,
      lastUsed: new Date(),
    },
  })
}

export async function getUsageStats(): Promise<{
  totalUsers: number
  totalSummaries: number
  averageUsage: number
}> {
  const [totalUsers, usageStats] = await Promise.all([
    prisma.user.count(),
    prisma.userUsage.aggregate({
      _sum: {
        summaryCount: true,
      },
      _avg: {
        summaryCount: true,
      },
    }),
  ])

  return {
    totalUsers,
    totalSummaries: usageStats._sum.summaryCount || 0,
    averageUsage: usageStats._avg.summaryCount || 0,
  }
}
