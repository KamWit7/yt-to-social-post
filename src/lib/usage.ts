import { UsageLevel } from '@/utils/constants'

export const DEFAULT_USAGE_LIMIT = 10 // Free tier limit

export function isUsageLimitExceeded(
  current: number,
  limit: number = DEFAULT_USAGE_LIMIT
): boolean {
  return current >= limit
}

export function getUsageWarningLevel(
  current: number,
  limit: number = DEFAULT_USAGE_LIMIT
): (typeof UsageLevel)[keyof typeof UsageLevel] {
  const percentage = (current / limit) * 100

  if (percentage >= 90) return UsageLevel.DANGER
  if (percentage >= 75) return UsageLevel.WARNING
  return UsageLevel.SAFE
}
