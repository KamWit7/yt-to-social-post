'use client'

import AnimatedSection from '@/components/animation/AnimatedSection'
import { Button } from '@/components/ui/button'
import { getUserUsageStats, UsageStats } from '@/lib/actions/usage'
import { ROUTES } from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import { AlertTriangle, BarChart3 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

interface UsageGateProps {
  children: React.ReactNode
}

type UsageStatsWithError = UsageStats & {
  error?: string
}

export const DEFAULT_USAGE_STATS: UsageStats = {
  success: false,
  usage: {
    current: 0,
    limit: 10,
    remaining: 10,
    percentage: 0,
    accountTier: AccountTier.free,
  },
}

export function UsageGate({ children }: UsageGateProps) {
  const { data: session, status } = useSession()

  const [usageStats, setUsageStats] = useState<UsageStatsWithError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkUsage() {
      if (!session?.user) {
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const stats = await getUserUsageStats()
        setUsageStats(stats)
      } catch (err) {
        console.error('Error fetching usage stats:', err)
        setError('Nie udało się sprawdzić limitu użycia')
        setUsageStats(DEFAULT_USAGE_STATS)
      } finally {
        setIsLoading(false)
      }
    }

    checkUsage()
  }, [session])

  if (status === 'loading' || isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  if (!session?.user) {
    return <>{children}</>
  }

  if (usageStats?.usage.accountTier === AccountTier.BYOK) {
    return <>{children}</>
  }

  if (error && usageStats?.success) {
    return <>{children}</>
  }

  if (usageStats?.success) {
    const { current, limit } = usageStats.usage
    const isLimitExceeded = current >= limit

    if (!isLimitExceeded) {
      return <>{children}</>
    }

    return (
      <AnimatedSection isVisible>
        <div className='text-center space-y-6 max-w-md mx-auto'>
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-red-500/20 rounded-full animate-pulse'></div>
              <div className='relative bg-gradient-to-r from-red-500 to-purple-600 p-4 rounded-full'>
                <AlertTriangle className='w-8 h-8 text-white animate-pulse' />
              </div>
            </div>
          </div>

          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              Limit darmowego planu wyczerpany
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              wykorzystałeś już wszystkie {limit} dostępnych podsumowań w ramach
              darmowego planu
            </p>
          </div>

          <div className='bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>
                wykorzystanie:
              </span>
              <span className='font-semibold text-gray-800 dark:text-gray-200'>
                {current}/{limit}
              </span>
            </div>

            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-black h-2 rounded-full transition-all duration-300'
                style={{ width: '100%' }}></div>
            </div>

            <div className='flex items-center justify-center text-xs text-gray-500 dark:text-gray-400'>
              <BarChart3 className='w-3 h-3 mr-1' />
              100% wykorzystane
            </div>
          </div>

          <div className='pt-2 max-w-xs mx-auto'>
            <Button
              asChild
              className='w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white'>
              <Link href={ROUTES.PROFILE}>Zobacz szczegóły użycia</Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    )
  }
}
