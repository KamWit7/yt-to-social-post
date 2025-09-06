'use client'

import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'
import { AuthGate } from './forms/AuthGate/AuthGate'

import { PurposeForm } from './forms/PurposeForm/PurposeForm'
import { TranscriptForm } from './forms/TranscriptForm/TranscriptForm'
import { YouTubeForm } from './forms/YouTubeForm/YouTubeForm'

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
        <AuthGate>
          <PurposeForm />
        </AuthGate>
      )
    default:
      return null
  }
}
