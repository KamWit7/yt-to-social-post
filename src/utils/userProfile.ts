import { Session } from 'next-auth'

import {
  AccountTier,
  UserProfileData,
} from '@/components/auth/UserProfile/UserProfile.helpers'

export function transformSessionToUserProfile(
  session: Session
): UserProfileData {
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    accountTier: 'free' as AccountTier, // Default tier, could be fetched from API
  }
}

export function validateUserSession(
  session: Session | null
): session is Session {
  return Boolean(session?.user?.id)
}
