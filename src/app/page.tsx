import Dashboard from '@/components/dashboard/Dashboard'
import { TranscriptionFormsProvider } from '@/components/dashboard/TranscriptionForms/TranscriptionFormsContext'

export default function Home() {
  return (
    <TranscriptionFormsProvider>
      <Dashboard />
    </TranscriptionFormsProvider>
  )
}
