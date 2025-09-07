import { Badge } from '@/components/ui/badge'
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
import { AlertTriangle, CheckCircle2, TrendingUp, Zap } from 'lucide-react'
import { redirect } from 'next/navigation'

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

export async function UsageStats() {
  const stats = await getUserUsageStats()

  if (!stats.success) {
    redirect(ROUTES.LOGIN)
  }

  const status = getUsageStatus(stats.usage.current)
  const StatusIcon = status.icon

  return (
    <Card>
      <CardHeader className='relative z-10 pb-4'>
        <div className='flex items-center justify-between'>
          <div className='space-y-1'>
            <CardTitle className='text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
              Usage Overview
            </CardTitle>
            <CardDescription className='text-muted-foreground/80'>
              Track your monthly summary generations
            </CardDescription>
          </div>

          <div className='relative hover:scale-110 hover:rotate-1 transition-transform duration-300'>
            <div className='absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl' />
            <div className='relative bg-gradient-to-br from-primary/10 to-primary/5 rounded-full p-3 border border-primary/20'>
              <Zap className='w-6 h-6 text-primary' />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className='relative z-10 space-y-8'>
        {/* Main Progress Section */}
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              <StatusIcon
                className={cn(
                  'w-5 h-5',
                  status.level === UsageLevel.DANGER && 'text-red-500',
                  status.level === UsageLevel.WARNING && 'text-yellow-500',
                  status.level === UsageLevel.SAFE && 'text-green-500'
                )}
              />
              <span className='text-sm font-medium text-muted-foreground'>
                {stats.usage.current} of {stats.usage.limit} used
              </span>
            </div>

            <Badge
              variant={
                status.level === UsageLevel.DANGER
                  ? 'destructive'
                  : status.level === UsageLevel.WARNING
                  ? 'secondary'
                  : 'default'
              }
              className={cn(
                'font-semibold transition-all duration-300 hover:scale-105',
                status.level === UsageLevel.SAFE &&
                  'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100',
                status.level === UsageLevel.WARNING &&
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-100'
              )}>
              {Math.round(stats.usage.percentage)}%
            </Badge>
          </div>

          <div className='origin-left'>
            <Progress
              value={stats.usage.percentage}
              className={cn(
                'h-3 transition-all duration-500 hover:h-4',
                'bg-gradient-to-r from-muted to-muted/50'
              )}
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center p-4 rounded-xl bg-gradient-to-br from-muted/50 to-muted/20 border border-muted/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group/stat'>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground group-hover/stat:text-foreground transition-colors'>
                Used This Month
              </p>
              <p className='text-3xl font-bold text-foreground hover:scale-110 transition-transform duration-300'>
                {stats.usage.current}
              </p>
            </div>
          </div>

          <div className='text-center p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg group/stat'>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground group-hover/stat:text-foreground transition-colors'>
                Monthly Limit
              </p>
              <p className='text-3xl font-bold text-primary hover:scale-110 transition-transform duration-300'>
                {stats.usage.limit}
              </p>
            </div>
          </div>

          <div className='text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950 dark:to-green-900/50 border border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 hover:shadow-lg group/stat'>
            <div className='space-y-2'>
              <p className='text-sm font-medium text-muted-foreground group-hover/stat:text-foreground transition-colors'>
                Remaining
              </p>
              <p className='text-3xl font-bold text-green-600 dark:text-green-400 hover:scale-110 transition-transform duration-300'>
                {stats.usage.remaining}
              </p>
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div
          className={cn(
            'p-4 rounded-xl border transition-all duration-300',
            status.level === UsageLevel.DANGER &&
              'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800',
            status.level === UsageLevel.WARNING &&
              'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800',
            status.level === UsageLevel.SAFE &&
              'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'
          )}>
          <div className='flex items-center gap-3'>
            <StatusIcon
              className={cn(
                'w-5 h-5 flex-shrink-0',
                status.level === UsageLevel.DANGER &&
                  'text-red-600 dark:text-red-400',
                status.level === UsageLevel.WARNING &&
                  'text-yellow-600 dark:text-yellow-400',
                status.level === UsageLevel.SAFE &&
                  'text-green-600 dark:text-green-400'
              )}
            />
            <p
              className={cn(
                'text-sm font-medium',
                status.level === UsageLevel.DANGER &&
                  'text-red-800 dark:text-red-200',
                status.level === UsageLevel.WARNING &&
                  'text-yellow-800 dark:text-yellow-200',
                status.level === UsageLevel.SAFE &&
                  'text-green-800 dark:text-green-200'
              )}>
              {status.level === UsageLevel.DANGER &&
                "You've reached your usage limit. Consider upgrading your plan."}
              {status.level === UsageLevel.WARNING &&
                "You're approaching your usage limit. Monitor your remaining summaries."}
              {status.level === UsageLevel.SAFE &&
                "You're well within your usage limits. Keep creating summaries!"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
