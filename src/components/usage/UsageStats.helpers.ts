import { getUsageWarningLevel } from '@/lib/usage'
import { UsageLevel } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  TrendingUp,
  Zap,
} from 'lucide-react'

export function getUsageStatus(current: number) {
  const status = getUsageWarningLevel(current)

  switch (status) {
    case UsageLevel.DANGER:
      return {
        level: UsageLevel.DANGER,
        color: 'destructive',
        icon: AlertTriangle,
      }
    case UsageLevel.WARNING:
      return { level: UsageLevel.WARNING, color: 'warning', icon: TrendingUp }
    default:
      return { level: UsageLevel.SAFE, color: 'success', icon: CheckCircle2 }
  }
}

export function getAccountTierInfo(tier: AccountTier) {
  switch (tier) {
    case AccountTier.BYOK:
      return {
        label: 'Własny klucz API',
        description: 'nieograniczone użycie z własnym kluczem Google Gemini',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-200 dark:border-purple-800',
      }
    default:
      return {
        label: 'Darmowy',
        description: 'ograniczone miesięczne użycie',
        icon: Zap,
        gradient: 'from-gray-500 to-gray-600',
        textColor: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-950/30',
        borderColor: 'border-gray-200 dark:border-gray-800',
      }
  }
}

export function getUsageMessage(
  isFreeAccount: boolean,
  usageLevel: (typeof UsageLevel)[keyof typeof UsageLevel]
) {
  if (!isFreeAccount) {
    return 'masz nieograniczone użycie dzięki własnemu kluczowi API'
  }

  switch (usageLevel) {
    case UsageLevel.DANGER:
      return 'rozważ upgrade planu i uzyskaj nieograniczone podsumowania z własnym kluczem.'
    case UsageLevel.WARNING:
      return 'zbliżasz się do swojego limitu użycia.'
    case UsageLevel.SAFE:
      return 'jesteś w granicach swoich limitów użycia.'
    default:
      return 'jesteś w granicach swoich limitów użycia.'
  }
}

export function getBadgeVariant(
  usageLevel: (typeof UsageLevel)[keyof typeof UsageLevel]
) {
  switch (usageLevel) {
    case UsageLevel.DANGER:
      return 'outline' as const
    case UsageLevel.WARNING:
      return 'secondary' as const
    case UsageLevel.SAFE:
      return 'default' as const
    default:
      return 'default' as const
  }
}
