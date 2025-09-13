import { ProfileSkeleton } from '@/components/auth/UserProfile/components/ProfileSkeleton'
import { UserProfile } from '@/components/auth/UserProfile/UserProfile'
import { UsageStatsSkeleton } from '@/components/usage/components/UsageStatsSkeleton'
import { UsageStats } from '@/components/usage/UsageStats'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Profil | YT Scribe',
  description:
    'Zarządzaj ustawieniami konta, wyświetl informacje o profilu i monitoruj statystyki użycia',
}

export default async function ProfilePage() {
  return (
    <>
      <Suspense fallback={<ProfileSkeleton className='flex-1 max-w-md' />}>
        <UserProfile className='flex-1 max-w-md' />
      </Suspense>
      <Suspense fallback={<UsageStatsSkeleton className='flex-1 max-w-md' />}>
        <UsageStats className='flex-1 max-w-md' />
      </Suspense>
    </>
  )
}
