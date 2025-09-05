import { ProfileSkeleton } from '@/components/auth/UserProfile/components/ProfileSkeleton'
import { UserProfile } from '@/components/auth/UserProfile/UserProfile'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Profile | YT Scribe',
  description: 'Manage your account settings and view your profile information',
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile />
    </Suspense>
  )
}
