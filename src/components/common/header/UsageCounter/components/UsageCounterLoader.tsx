import { Loader2 } from 'lucide-react'

export function UsageCounterLoader() {
  return (
    <div className='flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50'>
      <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
      <span className='text-sm text-muted-foreground'>...</span>
    </div>
  )
}
