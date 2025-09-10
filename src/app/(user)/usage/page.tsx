import { UsageSkeleton, UsageStats } from '@/components/usage'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Usage Dashboard | YT Scribe',
  description:
    'Monitor your usage statistics and track your monthly summary generations',
}

export default async function UsagePage() {
  return (
    <Suspense fallback={<UsageSkeleton />}>
      <UsageStats />
    </Suspense>
  )
}
