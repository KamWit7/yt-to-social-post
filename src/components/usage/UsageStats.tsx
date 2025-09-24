import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getUserUsageStats } from '@/lib/actions/usage'
import { getUsageWarningLevel } from '@/lib/usage'
import { cn } from '@/lib/utils'
import { ROUTES, UsageLevel } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import {
  AlertTriangle,
  CheckCircle2,
  Crown,
  Settings,
  TrendingUp,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AnimatedSection } from '../animation'

function getUsageStatus(current: number) {
  const status = getUsageWarningLevel(current)

  switch (status) {
    case UsageLevel.DANGER:
      return {
        level: UsageLevel.DANGER,
        color: 'destructive',
        icon: AlertTriangle,
      }
    case UsageLevel.WARNING:
      return { level: UsageLevel.WARNING, color: 'warning', icon: TrendingUp }
    default:
      return { level: UsageLevel.SAFE, color: 'success', icon: CheckCircle2 }
  }
}

function getAccountTierInfo(tier: AccountTier) {
  switch (tier) {
    case AccountTier.BYOK:
      return {
        label: 'Własny klucz API',
        description: 'Nieograniczone użycie z własnym kluczem Google Gemini',
        icon: Crown,
        gradient: 'from-purple-500 to-pink-500',
        textColor: 'text-purple-600 dark:text-purple-400',
        bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        borderColor: 'border-purple-200 dark:border-purple-800',
      }
    default:
      return {
        label: 'Darmowy',
        description: 'Ograniczone miesięczne użycie',
        icon: Zap,
        gradient: 'from-gray-500 to-gray-600',
        textColor: 'text-gray-600 dark:text-gray-400',
        bgColor: 'bg-gray-50 dark:bg-gray-950/30',
        borderColor: 'border-gray-200 dark:border-gray-800',
      }
  }
}

export async function UsageStats({ className }: { className?: string }) {
  const stats = await getUserUsageStats()

  if (!stats.success) {
    redirect(ROUTES.LOGIN)
  }

  const status = getUsageStatus(stats.usage.current)
  const StatusIcon = status.icon
  const tierInfo = getAccountTierInfo(stats.usage.accountTier)
  const TierIcon = tierInfo.icon
  const isFreeAccount = stats.usage.accountTier === AccountTier.free

  return (
    <Card className={className}>
      <CardHeader className='flex items-start justify-between'>
        <div>
          <CardTitle className='pb-2'>Przegląd Użycia</CardTitle>
          <CardDescription>
            Śledź swoje miesięczne generowanie podsumowań
          </CardDescription>
        </div>
        <Link href={ROUTES.SETTINGS}>
          <Button variant='outline' size='sm'>
            <Settings className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90' />
            Ustawienia
          </Button>
        </Link>
      </CardHeader>

      <CardContent>
        <AnimatedSection isVisible>
          <div className='space-y-6'>
            {isFreeAccount && (
              <div className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm font-medium text-muted-foreground'>
                      {stats.usage.current} z {stats.usage.limit} użyte
                    </span>
                  </div>

                  <Badge
                    variant={
                      status.level === UsageLevel.DANGER
                        ? 'destructive'
                        : status.level === UsageLevel.WARNING
                        ? 'secondary'
                        : 'default'
                    }>
                    {Math.round(stats.usage.percentage)}%
                  </Badge>
                </div>

                <Progress value={stats.usage.percentage} className='h-3' />
              </div>
            )}

            {/* Account Tier Section */}
            <div
              className={cn(
                'p-4 rounded-lg border-2 transition-all duration-300',
                tierInfo.bgColor,
                tierInfo.borderColor
              )}>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div
                    className={cn(
                      'p-2 rounded-full bg-gradient-to-r',
                      tierInfo.gradient
                    )}>
                    <TierIcon className='w-5 h-5 text-white' />
                  </div>
                  <div>
                    <p className='font-semibold text-foreground'>
                      Plan: {tierInfo.label}
                    </p>
                    <p className={cn('text-sm', tierInfo.textColor)}>
                      {tierInfo.description}
                    </p>
                  </div>
                </div>
                {isFreeAccount && (
                  <Link href={ROUTES.SETTINGS}>
                    <Button
                      size='sm'
                      className='group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105'>
                      <Crown className='w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110' />
                      Ulepsz
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className='flex flex-col md:flex-row gap-4'>
              <div className='flex-1 text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02]'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    Użyte w tym miesiącu
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {stats.usage.current}
                  </p>
                </div>
              </div>
              <div className='flex-1 text-center p-4 border rounded-lg hover:shadow-md transition-all duration-300 hover:scale-[1.02]'>
                <div className='space-y-2'>
                  <p className='text-sm font-medium text-muted-foreground'>
                    {isFreeAccount ? 'Miesięczny limit' : 'Nieograniczone'}
                  </p>
                  <p className='text-2xl font-bold text-foreground'>
                    {isFreeAccount ? stats.usage.limit : '∞'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Message */}
            <div className='flex items-start justify-center gap-3 border-t pt-4'>
              <StatusIcon
                className={cn(
                  'my-auto',
                  !isFreeAccount
                    ? 'text-green-500'
                    : status.level === UsageLevel.DANGER
                    ? 'text-red-500'
                    : status.level === UsageLevel.WARNING
                    ? 'text-yellow-500'
                    : 'text-green-500'
                )}
              />
              <p className='text-sm text-muted-foreground'>
                {!isFreeAccount
                  ? 'Masz nieograniczone użycie dzięki własnemu kluczowi API. Twórz bez limitów!'
                  : status.level === UsageLevel.DANGER
                  ? 'Osiągnąłeś swój limit użycia. Rozważ upgrade planu i uzyskaj nieograniczone podsumowania z własnym kluczem.'
                  : status.level === UsageLevel.WARNING
                  ? 'Zbliżasz się do swojego limitu użycia. Monitoruj pozostałe podsumowania.'
                  : 'Jesteś w granicach swoich limitów użycia. Kontynuuj tworzenie podsumowań!'}
              </p>
            </div>
          </div>
        </AnimatedSection>
      </CardContent>
    </Card>
  )
}
