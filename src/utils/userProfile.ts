import { Session } from 'next-auth'

import { UserProfileData } from '@/components/auth/UserProfile/UserProfile.helpers'
import { AccountTier } from '@prisma/client'

export function transformSessionToUserProfile(
  session: Session
): UserProfileData {
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    accountTier: session.user.usage?.accountTier ?? AccountTier.free,
  }
}

export function validateUserSession(
  session: Session | null
): session is Session {
  return Boolean(session?.user?.id)
}
