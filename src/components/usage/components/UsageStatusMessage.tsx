import { cn } from '@/lib/utils'
import { UsageLevel } from '@/utils/constants'
import { getUsageMessage, getUsageStatus } from '../UsageStats.helpers'

interface UsageStatusMessageProps {
  current: number
  isFreeAccount: boolean
}

export function UsageStatusMessage({
  current,
  isFreeAccount,
}: UsageStatusMessageProps) {
  const status = getUsageStatus(current)
  const StatusIcon = status.icon

  return (
    <div className='flex items-start justify-start gap-3 border-t pt-2'>
      <StatusIcon
        className={cn(
          'my-auto',
          !isFreeAccount && 'text-green-500',
          isFreeAccount && status.level === UsageLevel.SAFE && 'text-green-500',
          isFreeAccount &&
            status.level === UsageLevel.WARNING &&
            'text-yellow-500',
          isFreeAccount && status.level === UsageLevel.DANGER && 'text-red-500'
        )}
      />
      <p className='text-sm text-muted-foreground'>
        {getUsageMessage(isFreeAccount, status.level)}
      </p>
    </div>
  )
}
