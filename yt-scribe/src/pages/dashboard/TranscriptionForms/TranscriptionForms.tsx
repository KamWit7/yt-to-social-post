'use client'

import { DASHBOARD_TABS, type DashboardTab } from '../Dashboard.helpers'

import { PurposeForm } from './forms/PurposeForm/PurposeForm'
import { TranscriptForm } from './forms/TranscriptForm/TranscriptForm'
import { YouTubeForm } from './forms/YouTubeForm/YouTubeForm'

interface TranscriptionFormProps {
  transcript: string
  onTranscriptChange?: (transcript: string) => void
  onTabChange?: (tab: string) => void
  stepKey?: DashboardTab
  onStepComplete?: (
    step: 'youtube' | 'transcript' | 'purpose' | 'results'
  ) => void
  onLoadingStateChange?: (isLoading: boolean) => void
  onTranscriptUpdate?: (transcript: string) => void
}

export default function TranscriptionForm({
  transcript,
  onTranscriptChange,
  onTabChange,
  stepKey = DASHBOARD_TABS.YOUTUBE,
  onStepComplete,
  onLoadingStateChange,
  onTranscriptUpdate,
}: TranscriptionFormProps) {
  return (
    <>
      {stepKey === DASHBOARD_TABS.YOUTUBE && (
        <YouTubeForm
          onSubmit={(newTranscript) => {
            onTranscriptChange?.(newTranscript)
            onStepComplete?.(DASHBOARD_TABS.YOUTUBE)
            onTabChange?.(DASHBOARD_TABS.TRANSCRIPT)
          }}
          onLoadingStateChange={onLoadingStateChange}
        />
      )}

      {stepKey === DASHBOARD_TABS.TRANSCRIPT && (
        <TranscriptForm
          transcript={transcript}
          onSubmit={() => {
            onStepComplete?.(DASHBOARD_TABS.TRANSCRIPT)
            onTabChange?.(DASHBOARD_TABS.PURPOSE)
          }}
          onLoadingStateChange={onLoadingStateChange}
          onTranscriptUpdate={onTranscriptUpdate}
        />
      )}

      {stepKey === DASHBOARD_TABS.PURPOSE && (
        <PurposeForm
          transcript={transcript}
          onSubmit={() => {
            onStepComplete?.(DASHBOARD_TABS.PURPOSE)
            onStepComplete?.(DASHBOARD_TABS.RESULTS)
            onTabChange?.(DASHBOARD_TABS.RESULTS)
          }}
          onLoadingStateChange={onLoadingStateChange}
        />
      )}
    </>
  )
}
