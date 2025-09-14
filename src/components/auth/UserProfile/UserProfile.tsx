import { AnimatedSection } from '@/components/animation'
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
import { LogoutButton } from '../../common/LogoutButton/LogoutButton'
import { AccountDetails } from './components/AccountDetails'
import { EmptySessionCard } from './components/EmptySessionCard'
import { UserInfo } from './components/UserInfo'

export async function UserProfile({ className }: { className?: string }) {
  const session = await getServerSession(authOptions)

  if (!validateUserSession(session)) {
    return <EmptySessionCard />
  }

  const userProfile = transformSessionToUserProfile(session)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profil użytkownika</CardTitle>
        <CardDescription>
          Informacje o Twoim koncie i ustawienia
        </CardDescription>
      </CardHeader>

      <CardContent
        className='space-y-6 flex-1 flex flex-col
      justify-between
      '>
        <AnimatedSection isVisible>
          <div className='space-y-6'>
            <UserInfo user={userProfile} />

            <AccountDetails user={userProfile} />
          </div>

          <div className='pt-4'>
            <LogoutButton size='sm' variant='outline' />
          </div>
        </AnimatedSection>
      </CardContent>
    </Card>
  )
}
