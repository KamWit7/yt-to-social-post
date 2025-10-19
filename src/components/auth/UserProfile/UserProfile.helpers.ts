import { AccountTier } from '@prisma/client'

export interface UserProfileData {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  accountTier: AccountTier
}

export const ACCOUNT_TIER_LABELS: Record<AccountTier, string> = {
  free: 'darmowy',
  BYOK: 'własny klucz API',
} as const
