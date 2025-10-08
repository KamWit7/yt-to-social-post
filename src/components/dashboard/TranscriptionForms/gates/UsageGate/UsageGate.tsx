'use client'

import AnimatedSection from '@/components/animation/AnimatedSection'
import { Button } from '@/components/ui/button'
import { getUserUsageStats, UsageStats } from '@/lib/actions/usage'
import {
  ROUTES,
  USAGE_GATE_TEXT,
  USAGE_LIMIT_MESSAGES,
} from '@/utils/constants'
import { AccountTier } from '@prisma/client'
import { AlertTriangle, BarChart3 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useTranscriptionForms } from '../../context'

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
  const { handleSaveState } = useTranscriptionForms()

  const [usageStats, setUsageStats] = useState<UsageStatsWithError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkUsage() {
      if (!session?.user) {
        return // Let AuthGate handle authentication
      }

      setIsLoading(true)
      setError(null)

      try {
        const stats = await getUserUsageStats()
        setUsageStats(stats)
      } catch (err) {
        console.error('Error fetching usage stats:', err)
        setError(USAGE_LIMIT_MESSAGES.USAGE_CHECK_ERROR)
        // Fail-open approach: allow access if usage check fails
        setUsageStats(DEFAULT_USAGE_STATS)
      } finally {
        setIsLoading(false)
      }
    }

    checkUsage()
  }, [session])

  // Show loading spinner while checking session or usage
  if (status === 'loading' || isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600'></div>
      </div>
    )
  }

  // If no session, let AuthGate handle it
  if (!session?.user) {
    return <>{children}</>
  }

  // If user has BYOK tier, allow access
  if (usageStats?.usage.accountTier === AccountTier.BYOK) {
    return <>{children}</>
  }

  // If usage check failed but we're failing open, render children
  if (error && usageStats?.success) {
    return <>{children}</>
  }

  // If usage stats loaded successfully, check limits
  if (usageStats?.success) {
    const { current, limit } = usageStats.usage
    const isLimitExceeded = current >= limit

    // If within limits, render children
    if (!isLimitExceeded) {
      return <>{children}</>
    }

    // If limit exceeded, show usage gate
    return (
      <AnimatedSection isVisible>
        <div className='text-center space-y-6 max-w-md mx-auto'>
          {/* Animated Icon */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 bg-red-500/20 rounded-full animate-pulse'></div>
              <div className='relative bg-gradient-to-r from-red-500 to-purple-600 p-4 rounded-full'>
                <AlertTriangle className='w-8 h-8 text-white animate-pulse' />
              </div>
            </div>
          </div>

          {/* Title and Description */}
          <div className='space-y-3'>
            <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
              {USAGE_GATE_TEXT.TITLE}
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed'>
              {USAGE_GATE_TEXT.DESCRIPTION.replace('{limit}', limit.toString())}
            </p>
          </div>

          {/* Usage Stats */}
          <div className='bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 space-y-3'>
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>
                {USAGE_GATE_TEXT.USAGE_LABEL}
              </span>
              <span className='font-semibold text-gray-800 dark:text-gray-200'>
                {current}/{limit}
              </span>
            </div>

            {/* Progress Bar */}
            <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
              <div
                className='bg-black h-2 rounded-full transition-all duration-300'
                style={{ width: '100%' }}></div>
            </div>

            <div className='flex items-center justify-center text-xs text-gray-500 dark:text-gray-400'>
              <BarChart3 className='w-3 h-3 mr-1' />
              {USAGE_GATE_TEXT.USAGE_COMPLETE}
            </div>
          </div>

          {/* Action Button */}
          <div className='pt-2 max-w-xs mx-auto'>
            <Button
              asChild
              className='w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white'>
              <Link href={ROUTES.PROFILE} onClick={handleSaveState}>
                {USAGE_GATE_TEXT.VIEW_DETAILS_BUTTON}
              </Link>
            </Button>
          </div>
        </div>
      </AnimatedSection>
    )
  }
}
