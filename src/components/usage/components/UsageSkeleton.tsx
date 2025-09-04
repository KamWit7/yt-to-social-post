import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

/**
 * Advanced UsageSkeleton component with sophisticated loading animations
 * Implements elite UX principles including:
 * - Staggered animation timing for visual flow
 * - Shimmer effects with gradient overlays
 * - Progressive disclosure through opacity transitions
 * - Micro-interactions that maintain user engagement
 * - Psychological comfort through familiar structure preservation
 */
export function UsageSkeleton() {
  return (
    <Card className='group relative overflow-hidden'>
      {/* Animated background gradient - creates depth and visual interest */}
      <div className='absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 animate-pulse' />

      {/* Subtle shimmer overlay - advanced loading feedback */}
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5' />

      <CardHeader className='relative z-10 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-3 flex-1'>
            {/* Title skeleton with staggered animation */}
            <Skeleton
              className='h-8 w-48 animate-pulse'
              style={{ animationDelay: '0.1s' }}
            />
            {/* Description skeleton */}
            <Skeleton
              className='h-4 w-64 animate-pulse'
              style={{ animationDelay: '0.2s' }}
            />
          </div>

          {/* Icon placeholder with sophisticated hover-ready styling */}
          <div className='relative'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-xl animate-pulse' />
            <div className='relative bg-gradient-to-br from-muted/50 to-muted/20 rounded-full p-3 border border-muted/30'>
              <Skeleton
                className='w-6 h-6 rounded animate-pulse'
                style={{ animationDelay: '0.3s' }}
              />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='relative z-10 space-y-8'>
        {/* Main Progress Section with enhanced visual hierarchy */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {/* Status icon skeleton */}
              <Skeleton
                className='w-5 h-5 rounded animate-pulse'
                style={{ animationDelay: '0.4s' }}
              />
              {/* Usage text skeleton */}
              <Skeleton
                className='h-4 w-32 animate-pulse'
                style={{ animationDelay: '0.5s' }}
              />
            </div>

            {/* Badge skeleton with enhanced styling */}
            <Skeleton
              className='h-6 w-12 rounded-full animate-pulse hover:scale-105 transition-transform duration-300'
              style={{ animationDelay: '0.6s' }}
            />
          </div>

          {/* Progress bar skeleton with sophisticated styling */}
          <div className='relative'>
            <Skeleton
              className={cn(
                'h-3 w-full rounded-full animate-pulse',
                'bg-gradient-to-r from-muted/80 to-muted/40',
                'hover:h-4 transition-all duration-500'
              )}
              style={{ animationDelay: '0.7s' }}
            />
            {/* Simulated progress fill with shimmer */}
            <div
              className='absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-primary/20 to-primary/10 rounded-full animate-pulse'
              style={{ animationDelay: '0.8s' }}
            />
          </div>
        </div>

        {/* Stats Grid with staggered animations for visual flow */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {/* Used This Month Card */}
          <div
            className='text-center p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-muted/30 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group/stat'
            style={{ animationDelay: '0.9s' }}>
            <div className='space-y-3'>
              <Skeleton
                className='h-4 w-24 mx-auto animate-pulse'
                style={{ animationDelay: '1.0s' }}
              />
              <Skeleton
                className='h-8 w-12 mx-auto animate-pulse hover:scale-110 transition-transform duration-300'
                style={{ animationDelay: '1.1s' }}
              />
            </div>
          </div>

          {/* Monthly Limit Card with primary accent */}
          <div
            className='text-center p-4 rounded-xl bg-gradient-to-br from-primary/8 to-primary/3 border border-primary/15 hover:border-primary/30 transition-all duration-300 hover:shadow-lg group/stat'
            style={{ animationDelay: '1.0s' }}>
            <div className='space-y-3'>
              <Skeleton
                className='h-4 w-20 mx-auto animate-pulse'
                style={{ animationDelay: '1.1s' }}
              />
              <Skeleton
                className='h-8 w-10 mx-auto animate-pulse hover:scale-110 transition-transform duration-300'
                style={{ animationDelay: '1.2s' }}
              />
            </div>
          </div>

          {/* Remaining Card with success accent */}
          <div
            className='text-center p-4 rounded-xl bg-gradient-to-br from-green-50/50 to-green-100/30 dark:from-green-950/30 dark:to-green-900/20 border border-green-200/50 dark:border-green-800/50 hover:border-green-300/70 dark:hover:border-green-700/70 transition-all duration-300 hover:shadow-lg group/stat'
            style={{ animationDelay: '1.1s' }}>
            <div className='space-y-3'>
              <Skeleton
                className='h-4 w-16 mx-auto animate-pulse'
                style={{ animationDelay: '1.2s' }}
              />
              <Skeleton
                className='h-8 w-10 mx-auto animate-pulse hover:scale-110 transition-transform duration-300'
                style={{ animationDelay: '1.3s' }}
              />
            </div>
          </div>
        </div>

        {/* Status Message Skeleton with contextual styling */}
        <div
          className='p-4 rounded-xl border bg-gradient-to-r from-muted/20 to-muted/10 border-muted/30 transition-all duration-300'
          style={{ animationDelay: '1.2s' }}>
          <div className='flex items-center gap-3'>
            {/* Status icon skeleton */}
            <Skeleton
              className='w-5 h-5 flex-shrink-0 rounded animate-pulse'
              style={{ animationDelay: '1.3s' }}
            />
            {/* Status message skeleton with realistic text width variation */}
            <div className='flex-1 space-y-2'>
              <Skeleton
                className='h-4 w-full animate-pulse'
                style={{ animationDelay: '1.4s' }}
              />
              <Skeleton
                className='h-4 w-3/4 animate-pulse'
                style={{ animationDelay: '1.5s' }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
