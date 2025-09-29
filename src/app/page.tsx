'use client'

import Dashboard from '@/components/dashboard/Dashboard'
import { TranscriptionFormsProvider } from '@/components/dashboard/TranscriptionForms/context'

export default function Home() {
  return (
    <TranscriptionFormsProvider>
      <Dashboard />
    </TranscriptionFormsProvider>
  )
}
