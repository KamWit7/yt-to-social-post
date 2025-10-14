'use client'

import { DEFAULT_USAGE_STATS } from '@/components/dashboard/TranscriptionForms/gates/UsageGate'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useUsage } from '@/context'
import { getUserUsageStats, UsageStats } from '@/lib/actions/usage'
import { getUsageWarningLevel } from '@/lib/usage'
import { cn } from '@/lib/utils'
import { ROUTES, UsageLevel } from '@/utils/constants'
import { ArrowRight, ChartColumnIncreasing } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { USAGE_COUNTER_CONSTANTS } from '../constants'
import { UsageCounterLoader } from './components/UsageCounterLoader'

type UserCounterStats = UsageStats['usage']

export function UsageCounter() {
  const pathname = usePathname()

  const { data: session, status } = useSession()
  const { registerRefreshUsageHandler } = useUsage()

  const [usageStats, setUsageStats] = useState<UserCounterStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleGetUsageStats = useCallback(async () => {
    if (isLoading || !session?.user.id) {
      return
    }

    setIsLoading(true)
    setHasError(false)

    try {
      const stats = await getUserUsageStats()
      if (stats.success) {
        setUsageStats(stats.usage)
      } else {
        setHasError(true)
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
      setHasError(true)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 500))
      setIsLoading(false)
    }
  }, [isLoading, session?.user.id])

  useEffect(() => {
    handleGetUsageStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id])

  useEffect(() => {
    return registerRefreshUsageHandler(handleGetUsageStats)
  }, [registerRefreshUsageHandler, handleGetUsageStats])

  if (status === 'loading') {
    return <UsageCounterLoader />
  }

  if (!session?.user.id) {
    return null
  }

  if (pathname === ROUTES.PROFILE) {
    return null
  }

  // Use fetched stats or fallback to default values
  const currentStats = usageStats ?? DEFAULT_USAGE_STATS.usage

  const statusLevel = getUsageWarningLevel(
    currentStats.current,
    currentStats.limit,
    currentStats.accountTier
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='ghost' size='sm' disabled={isLoading}>
          <ChartColumnIncreasing
            className={cn(
              'w-6 h-6 transition-transform duration-200 hover:scale-105',
              statusLevel === UsageLevel.SAFE && 'stroke-green-500',
              statusLevel === UsageLevel.WARNING && 'stroke-yellow-500',
              statusLevel === UsageLevel.DANGER && 'stroke-red-500',
              statusLevel === UsageLevel.BYOK && 'stroke-purple-500'
            )}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side='bottom'
        className='max-w-xs p-4 border border-primary/20 bg-white/20 backdrop-blur-md'>
        <div className='space-y-2'>
          <p className='font-medium text-foreground'>
            {USAGE_COUNTER_CONSTANTS.TOOLTIP_TITLE}
          </p>
          <Link href={ROUTES.PROFILE}>
            <p className='text-sm text-muted-foreground leading-relaxed flex items-center gap-2 group hover:text-primary'>
              {USAGE_COUNTER_CONSTANTS.TOOLTIP_DESCRIPTION}
              <ArrowRight className='w-6 h-6 transition-transform duration-200 group-hover:translate-x-1' />
            </p>
          </Link>

          {hasError ? (
            <div className='text-xs text-red-500 pt-1'>
              Błąd podczas pobierania danych
            </div>
          ) : (
            <div className='flex items-center gap-2 pt-1'>
              <div
                className={cn(
                  'w-2 h-2 rounded-full',
                  statusLevel === UsageLevel.SAFE && 'bg-green-500',
                  statusLevel === UsageLevel.WARNING && 'bg-yellow-500',
                  statusLevel === UsageLevel.DANGER && 'bg-red-500',
                  statusLevel === UsageLevel.BYOK && 'bg-purple-500'
                )}
              />

              {statusLevel === UsageLevel.BYOK ? (
                <span className='text-xs text-muted-foreground'>
                  Nieograniczone użycie
                </span>
              ) : (
                <span className='text-xs text-muted-foreground'>
                  {Math.round(currentStats.percentage)}% wykorzystane
                  {usageStats && ' (odświeżone)'}
                </span>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
