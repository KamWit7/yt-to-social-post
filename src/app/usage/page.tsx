import { UsageHeader, UsageSkeleton, UsageStats } from '@/components/usage'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Usage Dashboard | YT Scribe',
  description:
    'Monitor your usage statistics and track your monthly summary generations',
}

export default async function UsagePage() {
  return (
    <div className='min-h-screen container mx-auto max-w-4xl py-8 px-4'>
      <div className='space-y-8'>
        <UsageHeader />

        <Suspense fallback={<UsageSkeleton />}>
          <UsageStats />
        </Suspense>
      </div>
    </div>
  )
}
