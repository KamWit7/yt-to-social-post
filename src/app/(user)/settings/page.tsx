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

/**
 * Settings page for user account management and BYOK configuration
 */
export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    redirect(ROUTES.LOGIN)
  }

  // Get user usage data to determine current tier and API key status
  const userUsage = await getUserUsage(session.user.id)

  return (
    <>
      {/* Instructions Section */}
      <ApiKeyInstructions className='max-w-md' />

      <Card className='max-w-md'>
        <CardHeader>
          <CardTitle>Użyj Własnego Klucza (BYOK)</CardTitle>
          <CardDescription>
            Użyj własnego klucza API Google Gemini do nieograniczonego
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
    </>
  )
}
