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
import { AccountDetails } from './components/AccountDetails'
import { EmptySessionCard } from './components/EmptySessionCard'
import { UserInfo } from './components/UserInfo'

export async function UserProfile({ className }: { className?: string }) {
  const session = await getServerSession(authOptions)

  if (!validateUserSession(session)) {
    return <EmptySessionCard />
  }

  const userProfile = await transformSessionToUserProfile(session)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Profil użytkownika</CardTitle>
        <CardDescription>
          Informacje o Twoim koncie i ustawienia
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatedSection isVisible>
          <div className='space-y-6'>
            <UserInfo user={userProfile} />

            <AccountDetails user={userProfile} />
          </div>
        </AnimatedSection>
      </CardContent>
    </Card>
  )
}
