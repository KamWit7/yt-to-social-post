import { AnimatedSection } from '@/components/animation'
import { AdditionalInfo } from '@/components/settings/AdditionalInfo'
import { ApiKeyForm } from '@/components/settings/ApiKeyForm'
import { ApiKeyInstructions } from '@/components/settings/ApiKeyInstructions'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { authOptions } from '@/lib/auth'
import { getUserUsage } from '@/lib/db/usage'
import { ROUTES } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect(ROUTES.LOGIN)
  }

  const userUsage = await getUserUsage(session.user.id)

  return (
    <div className='flex flex-col-reverse lg:flex-row gap-4'>
      <ApiKeyInstructions className='w-md' />

      <Card className='w-md'>
        <CardHeader>
          <CardTitle>Użyj własnego klucza (BYOK)</CardTitle>
          <CardDescription>
            użyj własnego klucza API Google Gemini do nieograniczonego
            przetwarzania
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatedSection isVisible>
            <div className='space-y-6'>
              <ApiKeyForm
                currentTier={userUsage?.accountTier || AccountTier.free}
                hasApiKey={!!userUsage?.apiKey}
              />

              <AdditionalInfo />
            </div>
          </AnimatedSection>
        </CardContent>
      </Card>
    </div>
  )
}
