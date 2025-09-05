import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import {
  transformSessionToUserProfile,
  validateUserSession,
} from '@/utils/userProfile'
import { getServerSession } from 'next-auth'
import { LogoutButton } from '../../common/LogoutButton'
import { AccountDetails } from './components/AccountDetails'
import { EmptySessionCard } from './components/EmptySessionCard'
import { UserInfo } from './components/UserInfo'

export async function UserProfile() {
  const session = await getServerSession(authOptions)

  if (!validateUserSession(session)) {
    return <EmptySessionCard />
  }

  const userProfile = transformSessionToUserProfile(session)

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>Your account information and settings</CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <UserInfo user={userProfile} />

        <AccountDetails user={userProfile} />

        <div className='pt-4'>
          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  )
}
