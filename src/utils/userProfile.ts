import { Session } from 'next-auth'

import { UserProfileData } from '@/components/auth/UserProfile/UserProfile.helpers'
import { getUserUsage } from '@/lib/db/usage'
import { AccountTier } from '@prisma/client'

export async function transformSessionToUserProfile(
  session: Session
): Promise<UserProfileData> {
  'use server'

  const usage = await getUserUsage(session?.user.id)

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    accountTier: usage?.accountTier ?? AccountTier.free,
  }
}

export function validateUserSession(
  session: Session | null
): session is Session {
  return Boolean(session?.user?.id)
}
