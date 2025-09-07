'use client'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { getUserUsageStats } from '@/lib/actions/usage'
import { getUsageWarningLevel } from '@/lib/usage'
import { cn } from '@/lib/utils'
import { ROUTES, UsageLevel } from '@/utils/constants'
import { ArrowRight } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { USAGE_COUNTER_CONSTANTS } from '../constants'
import { UsageCounterLoader } from './components/UsageCounterLoader'

type UsageStats = {
  current: number
  limit: number
  remaining: number
  percentage: number
}

export function UsageCounter() {
  const pathname = usePathname()

  const { data: session, status } = useSession()

  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)

  const handleGetUsageStats = async () => {
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
  }

  useEffect(() => {
    handleGetUsageStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id])

  if (pathname === ROUTES.USAGE) {
    return null
  }

  if (status === 'loading') {
    return <UsageCounterLoader />
  }

  if (!session?.user.id) {
    return null
  }

  // Use fetched stats or fallback to default values
  const currentStats = usageStats || {
    current: 0,
    limit: 10,
    remaining: 10,
    percentage: 0,
  }

  const statusLevel = getUsageWarningLevel(
    currentStats.current,
    currentStats.limit
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='sm'
          onClick={handleGetUsageStats}
          disabled={isLoading}>
          <div className='relative flex items-center gap-2'>
            <span
              className={cn(
                'text-sm font-semibold transition-colors duration-200',
                isLoading && 'text-muted-foreground',
                !isLoading &&
                  statusLevel === UsageLevel.SAFE &&
                  'text-green-700 dark:text-green-300',
                !isLoading &&
                  statusLevel === UsageLevel.WARNING &&
                  'text-yellow-700 dark:text-yellow-300',
                !isLoading &&
                  statusLevel === UsageLevel.DANGER &&
                  'text-red-700 dark:text-red-300'
              )}>
              {isLoading
                ? 'Sprawdzanie...'
                : statusLevel === UsageLevel.SAFE
                ? 'Dostępne'
                : statusLevel === UsageLevel.WARNING
                ? 'Ograniczone'
                : 'Wyczerpane'}
            </span>
          </div>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side='bottom'
        className='max-w-xs p-4 border border-primary/20'>
        <div className='space-y-2'>
          <p className='font-medium text-foreground'>
            {USAGE_COUNTER_CONSTANTS.TOOLTIP_TITLE}
          </p>
          <Link href={ROUTES.USAGE}>
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
                  statusLevel === UsageLevel.DANGER && 'bg-red-500'
                )}
              />

              <span className='text-xs text-muted-foreground'>
                {Math.round(currentStats.percentage)}% wykorzystane
                {usageStats && ' (odświeżone)'}
              </span>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
