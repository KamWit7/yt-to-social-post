'use client'

import { useSession } from 'next-auth/react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  transformSessionToUserProfile,
  validateUserSession,
} from '@/utils/userProfile'
import { AccountDetails } from './AccountDetails'
import { LogoutButton } from './LogoutButton'
import { ProfileSkeleton } from './ProfileSkeleton'
import { UserInfo } from './UserInfo'

interface UserProfileProps {
  className?: string
}

function EmptySessionCard() {
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardContent className='pt-6'>
        <div className='text-center'>
          <p className='text-muted-foreground'>No user session found</p>
        </div>
      </CardContent>
    </Card>
  )
}

export function UserProfile({ className = '' }: UserProfileProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <ProfileSkeleton className={className} />
  }

  if (!validateUserSession(session)) {
    return <EmptySessionCard />
  }

  const userProfile = transformSessionToUserProfile(session)

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information and settings</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <UserInfo
          name={userProfile.name}
          email={userProfile.email}
          image={userProfile.image}
        />

        <AccountDetails
          userId={userProfile.id}
          accountTier={userProfile.accountTier}
        />

        <div className='pt-4'>
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
