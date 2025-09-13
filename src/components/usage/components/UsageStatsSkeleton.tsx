'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface UsageStatsSkeletonProps {
  className?: string
}

export function UsageStatsSkeleton({ className }: UsageStatsSkeletonProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex items-start justify-between'>
        <div>
          <CardTitle className='pb-2'>
            <Skeleton className='h-6 w-32' />
          </CardTitle>
          <CardDescription>
            <Skeleton className='h-4 w-56' />
          </CardDescription>
        </div>
        <Skeleton className='h-9 w-24' />
      </CardHeader>

      <CardContent className='space-y-6'>
        {/* Progress section */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-4 w-32' />
            <Skeleton className='h-5 w-12 rounded-full' />
          </div>
          <Skeleton className='h-3 w-full rounded-full' />
        </div>

        {/* Account Tier Section */}
        <div className='p-4 rounded-lg border-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Skeleton className='w-9 h-9 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-5 w-24' />
                <Skeleton className='h-4 w-40' />
              </div>
            </div>
            <Skeleton className='h-8 w-20' />
          </div>
        </div>

        {/* Stats Cards */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1 text-center p-4 border rounded-lg'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32 mx-auto' />
              <Skeleton className='h-8 w-8 mx-auto' />
            </div>
          </div>
          <div className='flex-1 text-center p-4 border rounded-lg'>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-28 mx-auto' />
              <Skeleton className='h-8 w-8 mx-auto' />
            </div>
          </div>
        </div>

        {/* Status Message */}
        <div className='flex items-start justify-center gap-3 border-t pt-4'>
          <Skeleton className='w-5 h-5 mt-1 rounded-full' />
          <div className='flex-1 space-y-2'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-3/4' />
            <Skeleton className='h-8 w-32' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
