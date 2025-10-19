import { Skeleton } from '@/components/ui/skeleton'

interface ContentSkeletonProps {
  lines?: number
}

export function ContentSkeleton({ lines = 6 }: ContentSkeletonProps) {
  const widths = [
    'w-full',
    'w-[90%]',
    'w-[95%]',
    'w-[85%]',
    'w-full',
    'w-[80%]',
  ]

  return (
    <div className='space-y-3'>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${widths[index % widths.length]}`}
        />
      ))}
    </div>
  )
}
