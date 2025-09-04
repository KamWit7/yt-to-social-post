export type AccountTier = 'free' | 'premium' | 'enterprise'

export interface UserProfileData {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  accountTier: AccountTier
}

export const ACCOUNT_TIER_LABELS: Record<AccountTier, string> = {
  free: 'Free Tier',
  premium: 'Premium',
  enterprise: 'Enterprise',
} as const
