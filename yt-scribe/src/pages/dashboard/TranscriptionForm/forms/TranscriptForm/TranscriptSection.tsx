'use client'

import AnimatedSection from '@/components/animation/AnimatedSection'
import { ControlledTextarea } from '@/components/common/form'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/ui/SectionHeader'
import { FileText } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../../../Dashboard.helpers'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import {
  ANIMATION_DELAYS,
  BaseSectionProps,
  BUTTON_STYLES,
  getSectionVisibility,
  LoadingSpinner,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'

type TranscriptSectionProps = BaseSectionProps & {
  stepKey?: DashboardTab
}

export function TranscriptSection({
  isLoading,
  isTranscriptLoading,
  stepKey = DASHBOARD_TABS.TRANSCRIPT,
  transcriptError,
  onFetchTranscript,
  onStepComplete,
  onTabChange,
}: TranscriptSectionProps) {
  // Watch form values for conditional rendering
  const transcript = useWatch({ name: FORM_FIELD_NAMES.TRANSCRIPT })

  // Check if transcript is available
  const hasTranscript = Boolean(transcript && transcript.trim().length > 0)

  return (
    <AnimatedSection
      isVisible={getSectionVisibility(stepKey === DASHBOARD_TABS.TRANSCRIPT)}
      delay={ANIMATION_DELAYS.section}
      className='space-y-8'>
      <SectionHeader
        icon={<FileText className='w-6 h-6 text-white' />}
        title='Przygotuj Transkrypcję'
        subtitle='Edytuj transkrypcję i wybierz cel jej przetwarzania'
        iconBgColor='bg-gradient-to-r from-blue-500 to-blue-600'
      />

      <div className='space-y-8'>
        <div className='space-y-4'>
          <ControlledTextarea
            name={FORM_FIELD_NAMES.TRANSCRIPT}
            label='Transkrypcja'
            placeholder='Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...'
            disabled={isLoading || isTranscriptLoading}
            required
            rows={8}
            textareaClassName='max-h-[300px] overflow-y-auto pr-10'
            icon={
              isTranscriptLoading ? (
                <LoadingSpinner />
              ) : (
                <FileText className='w-5 h-5' />
              )
            }
          />
        </div>

        {transcriptError && (
          <ErrorDisplay
            error={transcriptError}
            onRetry={onFetchTranscript}
            isRetrying={isTranscriptLoading}
            showBackButton={true}
            onBack={() => onTabChange?.(DASHBOARD_TABS.YOUTUBE)}
          />
        )}
      </div>

      {stepKey === DASHBOARD_TABS.TRANSCRIPT && (
        <div>
          <Button
            type='button'
            onClick={() => {
              onStepComplete?.('transcript')
              onTabChange?.(DASHBOARD_TABS.PURPOSE)
            }}
            disabled={!hasTranscript}
            className={BUTTON_STYLES.transcriptFullWidth}>
            Następny krok
          </Button>
        </div>
      )}
    </AnimatedSection>
  )
}
