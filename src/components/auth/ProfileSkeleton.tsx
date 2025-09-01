'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ProfileSkeletonProps {
  className?: string
}

export function ProfileSkeleton({ className = '' }: ProfileSkeletonProps) {
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-32' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-48' />
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-6'>
        <div className='flex flex-col items-center space-y-4'>
          <Skeleton className='w-16 h-16 rounded-full' />

          <div className='text-center space-y-2'>
            <Skeleton className='h-6 w-24 mx-auto' />
            <Skeleton className='h-4 w-40 mx-auto' />
          </div>
        </div>

        <div className='border-t pt-4'>
          <div className='space-y-3'>
            <div className='flex justify-between items-center'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-4 w-32' />
            </div>

            <div className='flex justify-between items-center'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-16' />
            </div>
          </div>
        </div>

        <div className='pt-4'>
          <Skeleton className='h-10 w-full' />
        </div>
      </CardContent>
    </Card>
  )
}
