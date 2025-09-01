import { Skeleton } from '@/components/ui/skeleton'

interface SkeletonLoaderProps {
  lines?: number
  type?: 'text' | 'list'
}

export default function SkeletonLoader({
  lines = 3,
  type = 'text',
}: SkeletonLoaderProps) {
  return (
    <div className='space-y-3 animate-pulse'>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className='flex items-center space-x-2'>
          {type === 'list' && <Skeleton className='h-4 w-4 rounded-full' />}
          <Skeleton
            className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        </div>
      ))}
    </div>
  )
}
