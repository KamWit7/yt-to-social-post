import { ApiKeyForm } from '@/components/settings/ApiKeyForm'
import { ApiKeyInstructions } from '@/components/settings/ApiKeyInstructions'
import { SecurityInfo } from '@/components/settings/SecurityInfo'
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
    <div className='container mx-auto py-8 px-4 max-w-4xl'>
      <div className='space-y-8'>
        {/* Page Header */}
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
          <p className='text-muted-foreground'>
            Manage your account settings and API configuration
          </p>
        </div>

        {/* BYOK Configuration Section */}
        <Card>
          <CardHeader>
            <CardTitle>Bring Your Own Key (BYOK)</CardTitle>
            <CardDescription>
              Use your own Google Gemini API key for unlimited processing
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <ApiKeyForm
              currentTier={userUsage?.accountTier || AccountTier.free}
              hasApiKey={!!userUsage?.apiKey}
            />
          </CardContent>
        </Card>

        {/* Instructions Section */}
        <ApiKeyInstructions />

        {/* Security Information */}
        <SecurityInfo />
      </div>
    </div>
  )
}
