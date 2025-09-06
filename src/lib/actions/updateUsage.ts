'use server'

import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { checkUsageLimit, incrementUsage } from '../db/usage'
import { DEFAULT_USAGE_LIMIT } from '../usage'

export async function trackUserUsage(): Promise<{
  success: boolean
  usage: {
    current: number
    limit: number
  } | null
  error?: string
}> {
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
