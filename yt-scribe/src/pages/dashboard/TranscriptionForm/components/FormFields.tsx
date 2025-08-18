'use client'

import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import AILoadingAnimation from '@/components/animation/AILoadingAnimation'
import { motion } from 'framer-motion'
import { DASHBOARD_TABS, type DashboardTab } from '../../Dashboard.helpers'
import { PurposeSection } from './sections/PurposeSection'
import { TranscriptSection } from './sections/TranscriptSection'
import { YouTubeSection } from './sections/YouTubeSection'

interface FormFieldsProps {
  isLoading: boolean
  isTranscriptLoading?: boolean
  onFetchTranscript?: () => void
  canFetchTranscript?: boolean
  stepKey?: DashboardTab
  onTabChange?: (tab: string) => void
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>
  transcriptError?: Error | null
  onStepComplete?: (
    step: 'youtube' | 'transcript' | 'purpose' | 'results'
  ) => void
}

export function FormFields({
  isLoading,
  isTranscriptLoading,
  onFetchTranscript,
  canFetchTranscript,
  stepKey = DASHBOARD_TABS.YOUTUBE,
  onTabChange,
  onSubmit,
  transcriptError,
  onStepComplete,
}: FormFieldsProps) {
  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )

  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data?.map((item) => ({
        label: item.label,
        value: item.code,
      }))
    : []

  // Show AI loading animation when processing
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <AILoadingAnimation
          message='Przetwarzam transkrypcję z AI...'
          className='my-8'
        />
      </motion.div>
    )
  }

  return (
    <div className='space-y-12'>
      {/* Section 1: URL Input and Generate Button */}
      {stepKey === DASHBOARD_TABS.YOUTUBE && (
        <YouTubeSection
          isLoading={isLoading}
          isTranscriptLoading={isTranscriptLoading}
          onFetchTranscript={onFetchTranscript}
          canFetchTranscript={canFetchTranscript}
          transcriptError={transcriptError}
        />
      )}

      {/* Section 2: Transcript and Purpose Selection - appears after transcript is available */}
      {stepKey === DASHBOARD_TABS.TRANSCRIPT && (
        <TranscriptSection
          isLoading={isLoading}
          isTranscriptLoading={isTranscriptLoading}
          stepKey={stepKey}
          transcriptError={transcriptError}
          onFetchTranscript={onFetchTranscript}
          onStepComplete={onStepComplete}
          onTabChange={onTabChange}
        />
      )}

      {/* Section 3: Purpose Selection */}
      {stepKey === DASHBOARD_TABS.PURPOSE && (
        <PurposeSection
          isLoading={isLoading}
          isTranscriptLoading={isTranscriptLoading}
          isPurposeLoading={isPurposeLoading}
          stepKey={stepKey}
          purposeOptions={purposeOptions}
          transcriptError={transcriptError}
          onFetchTranscript={onFetchTranscript}
          onStepComplete={onStepComplete}
          onTabChange={onTabChange}
          onSubmit={onSubmit}
        />
      )}
    </div>
  )
}
