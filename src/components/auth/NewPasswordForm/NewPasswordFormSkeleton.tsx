'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface NewPasswordFormSkeletonProps {
  className?: string
}

export function NewPasswordFormSkeleton({
  className = '',
}: NewPasswordFormSkeletonProps) {
  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-6 w-40' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-56' />
        </CardDescription>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Password field skeleton */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Confirm password field skeleton */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-10 w-full' />
        </div>

        {/* Submit button skeleton */}
        <Skeleton className='h-10 w-full' />
      </CardContent>
    </Card>
  )
}
