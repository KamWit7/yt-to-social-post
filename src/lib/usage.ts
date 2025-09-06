import { checkUsageLimit, getUserUsage, incrementUsage } from '@/lib/db/usage'

export const DEFAULT_USAGE_LIMIT = 10 // Free tier limit


export async function getUserUsageStats(userId: string): Promise<{
  current: number
  limit: number
  remaining: number
  percentage: number
}> {
  const usage = await getUserUsage(userId)
  const current = usage?.summaryCount || 0
  const limit = DEFAULT_USAGE_LIMIT
  const remaining = Math.max(0, limit - current)
  const percentage = Math.min(100, (current / limit) * 100)

  return {
    current,
    limit,
    remaining,
    percentage,
  }
}

export function isUsageLimitExceeded(
  current: number,
  limit: number = DEFAULT_USAGE_LIMIT
): boolean {
  return current >= limit
}

export function getUsageWarningLevel(
  current: number,
  limit: number = DEFAULT_USAGE_LIMIT
): 'safe' | 'warning' | 'danger' {
  const percentage = (current / limit) * 100

  if (percentage >= 90) return 'danger'
  if (percentage >= 75) return 'warning'
  return 'safe'
}
