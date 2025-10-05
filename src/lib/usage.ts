import { UsageLevel } from '@/utils/constants'
import { AccountTier } from '@prisma/client'

export const DEFAULT_USAGE_LIMIT = 10 // Free tier limit

export function getUsageWarningLevel(
  current: number,
  limit: number = DEFAULT_USAGE_LIMIT,
  accountTier: AccountTier = AccountTier.free
): (typeof UsageLevel)[keyof typeof UsageLevel] {
  if (accountTier === AccountTier.BYOK) {
    return UsageLevel.BYOK
  }

  const percentage = (current / limit) * 100

  if (percentage >= 90) return UsageLevel.DANGER
  if (percentage >= 75) return UsageLevel.WARNING
  return UsageLevel.SAFE
}
