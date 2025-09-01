import { Session } from 'next-auth'

export type AccountTier = 'free' | 'premium' | 'enterprise'

export interface UserProfileData {
  id: string
  name: string | null
  email: string | null
  image: string | null
  accountTier: AccountTier
}

export interface UserProfileProps {
  session: Session | null
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

export const ACCOUNT_TIER_LABELS: Record<AccountTier, string> = {
  free: 'Free Tier',
  premium: 'Premium',
  enterprise: 'Enterprise',
} as const
