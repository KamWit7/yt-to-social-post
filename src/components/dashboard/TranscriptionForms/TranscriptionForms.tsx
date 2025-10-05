'use client'

import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'
import { AuthGate } from './gates/AuthGate/AuthGate'

import { PurposeForm } from './forms/PurposeForm/PurposeForm'
import { TranscriptForm } from './forms/TranscriptForm/TranscriptForm'
import { YouTubeForm } from './forms/YouTubeForm/YouTubeForm'
import { UsageGate } from './gates/UsageGate/UsageGate'

interface TranscriptionFormProps {
  stepKey: DashboardTab
}

export default function TranscriptionForm({ stepKey }: TranscriptionFormProps) {
  switch (stepKey) {
    case DASHBOARD_TABS.YOUTUBE:
      return <YouTubeForm />
    case DASHBOARD_TABS.TRANSCRIPT:
      return <TranscriptForm />
    case DASHBOARD_TABS.PURPOSE:
      return (
        <UsageGate>
          <AuthGate>
            <PurposeForm />
          </AuthGate>
        </UsageGate>
      )
    default:
      return null
  }
}
