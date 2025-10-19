import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { getBadgeVariant, getUsageStatus } from '../UsageStats.helpers'

interface UsageProgressProps {
  current: number
  limit: number
  percentage: number
}

export function UsageProgress({
  current,
  limit,
  percentage,
}: UsageProgressProps) {
  const status = getUsageStatus(current)

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium text-muted-foreground'>
            {current} z {limit} użyte
          </span>
        </div>

        <Badge variant={getBadgeVariant(status.level)}>
          {Math.round(percentage)}%
        </Badge>
      </div>

      <Progress value={percentage} className='h-2' />
    </div>
  )
}
