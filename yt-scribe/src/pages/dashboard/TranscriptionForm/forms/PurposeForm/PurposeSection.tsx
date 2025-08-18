'use client'

import { AnimatedSection } from '@/components/animation'
import { ControlledSelect } from '@/components/common/form'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/ui/SectionHeader'
import { Sparkles } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../../../Dashboard.helpers'
import { ConditionalOptions } from '../../components/ConditionalOptions'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import {
  ANIMATION_DELAYS,
  BaseSectionProps,
  BUTTON_STYLES,
  getSectionVisibility,
  LoadingSpinner,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'

type PurposeSectionProps = BaseSectionProps & {
  isPurposeLoading?: boolean
  stepKey?: DashboardTab
  purposeOptions: Array<{ label: string; value: string }>
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>
}

export function PurposeSection({
  isLoading,
  isTranscriptLoading,
  isPurposeLoading,
  stepKey = DASHBOARD_TABS.PURPOSE,
  purposeOptions,
  transcriptError,
  onFetchTranscript,
  onStepComplete,
  onTabChange,
  onSubmit,
}: PurposeSectionProps) {
  const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })

  return (
    <AnimatedSection
      isVisible={getSectionVisibility(stepKey === DASHBOARD_TABS.PURPOSE)}
      delay={ANIMATION_DELAYS.section}
      className='space-y-8'>
      <div>
        <SectionHeader
          icon={<Sparkles className='w-6 h-6 text-white' />}
          title='W jakim celu przetwarzasz transkrypcję?'
          subtitle='Wybierz cel przetwarzania i dostosuj opcje do swoich potrzeb'
          iconBgColor='bg-gradient-to-r from-purple-500 to-purple-600'
          className={stepKey === DASHBOARD_TABS.PURPOSE ? '' : 'mt-12'}
        />

        <div className='space-y-8'>
          <ControlledSelect
            name={FORM_FIELD_NAMES.PURPOSE}
            placeholder='Wybierz cel...'
            disabled={isLoading || isTranscriptLoading || isPurposeLoading}
            required
            options={purposeOptions}
            className='sm:w-1/2'
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

        <ConditionalOptions
          purpose={purpose}
          isLoading={isLoading}
          isTranscriptLoading={isTranscriptLoading}
        />
      </div>

      {stepKey === DASHBOARD_TABS.PURPOSE && (
        <div>
          <Button
            type='button'
            onClick={() => {
              onStepComplete?.('purpose')
              onTabChange?.(DASHBOARD_TABS.RESULTS)
              onSubmit?.()
            }}
            disabled={isLoading}
            className={BUTTON_STYLES.purposeFullWidth}>
            {isLoading ? (
              <>
                <LoadingSpinner className='w-4 h-4 mr-2' />
                Przetwarzam...
              </>
            ) : (
              <>
                <Sparkles className='w-4 h-4 mr-2' />
                Przetwórz z AI
              </>
            )}
          </Button>
        </div>
      )}
    </AnimatedSection>
  )
}
