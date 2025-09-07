'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { checkUsageLimit, getUserUsage, incrementUsage } from '../db/usage'
import { DEFAULT_USAGE_LIMIT } from '../usage'

export type UsageBaseResponse = {
  success: boolean
  error?: string
}

export type UsageResponse = UsageBaseResponse & {
  usage: {
    current: number
    limit: number
  } | null
}

export async function trackUserUsage(): Promise<UsageResponse> {
  try {
    const session = await getServerSession(authOptions)

    const userId = session?.user.id

    if (!userId) {
      return {
        success: false,
        usage: null,
        error: 'User not found',
      }
    }

    // Check if user is within limits before incrementing
    const limitCheck = await checkUsageLimit(userId, DEFAULT_USAGE_LIMIT)

    if (!limitCheck.withinLimit) {
      return {
        success: false,
        usage: {
          current: limitCheck.currentUsage,
          limit: limitCheck.limit,
        },
        error: 'Usage limit exceeded',
      }
    }

    // Increment usage
    const updatedUsage = await incrementUsage(userId)

    return {
      success: true,
      usage: {
        current: updatedUsage.summaryCount,
        limit: DEFAULT_USAGE_LIMIT,
      },
    }
  } catch (error) {
    console.error('Error tracking usage:', error)
    return {
      success: false,
      usage: {
        current: 0,
        limit: DEFAULT_USAGE_LIMIT,
      },
      error: 'Failed to track usage',
    }
  }
}

type UsageStats = UsageBaseResponse & {
  usage: {
    current: number
    limit: number
    remaining: number
    percentage: number
  }
}

export async function getUserUsageStats(): Promise<UsageStats> {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return {
      success: false,
      usage: {
        current: 0,
        limit: DEFAULT_USAGE_LIMIT,
        remaining: 0,
        percentage: 0,
      },

      error: 'User not found',
    }
  }

  const usage = await getUserUsage(session?.user.id)

  const current = usage?.summaryCount || 0
  const limit = DEFAULT_USAGE_LIMIT
  const remaining = Math.max(0, limit - current)
  const percentage = Math.min(100, (current / limit) * 100)

  return {
    success: true,
    usage: { current, limit, remaining, percentage },
  }
}
