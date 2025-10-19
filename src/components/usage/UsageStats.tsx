import { Card, CardContent } from '@/components/ui/card'
import { getUserUsageStats } from '@/lib/actions/usage'
import { ROUTES } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import { redirect } from 'next/navigation'
import { AnimatedSection } from '../animation'
import {
  AccountTierCard,
  UsageHeader,
  UsageProgress,
  UsageStatsCards,
  UsageStatusMessage,
} from './components'

export async function UsageStats({ className }: { className?: string }) {
  const stats = await getUserUsageStats()

  if (!stats.success) {
    redirect(ROUTES.LOGIN)
  }

  const isFreeAccount = stats.usage.accountTier === AccountTier.free

  return (
    <Card className={className}>
      <UsageHeader isFreeAccount={isFreeAccount} />

      <CardContent>
        <AnimatedSection isVisible>
          <div className='space-y-6'>
            {isFreeAccount && (
              <UsageProgress
                current={stats.usage.current}
                limit={stats.usage.limit}
                percentage={stats.usage.percentage}
              />
            )}

            <AccountTierCard accountTier={stats.usage.accountTier} />

            <UsageStatsCards
              current={stats.usage.current}
              limit={stats.usage.limit}
              isFreeAccount={isFreeAccount}
            />

            <UsageStatusMessage
              current={stats.usage.current}
              isFreeAccount={isFreeAccount}
            />
          </div>
        </AnimatedSection>
      </CardContent>
    </Card>
  )
}
