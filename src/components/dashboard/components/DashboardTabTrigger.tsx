import { TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { TabConfig } from '../Dashboard.helpers'

interface DashboardTabTriggerProps {
  config: TabConfig
  stepCompleted: boolean
  className?: string
}

export default function DashboardTabTrigger({
  config,
  stepCompleted,
  className,
}: DashboardTabTriggerProps) {
  const Icon = config.icon

  return (
    <TabsTrigger
      value={config.value}
      className={cn('flex items-center gap-2', className)}
      disabled={config.disabled}>
      <Icon className='w-4 h-4' />
      <span className='hidden sm:inline'>{config.label}</span>
      {stepCompleted && (
        <div className='w-2 h-2 bg-green-500 rounded-full'></div>
      )}
    </TabsTrigger>
  )
}
