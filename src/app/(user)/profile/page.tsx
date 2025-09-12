import { ProfileSkeleton } from '@/components/auth/UserProfile/components/ProfileSkeleton'
import { UserProfile } from '@/components/auth/UserProfile/UserProfile'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Profil | YT Scribe',
  description: 'Zarządzaj ustawieniami konta i wyświetl informacje o profilu',
}

export default async function ProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <UserProfile />
    </Suspense>
  )
}
