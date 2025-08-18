'use client'

import { AnimatedSection } from '@/components/animation'
import { ControlledInput } from '@/components/common/form'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/ui/SectionHeader'
import { Wand2, Youtube } from 'lucide-react'
import { ErrorDisplay } from '../../components/ErrorDisplay'
import {
  ANIMATION_DELAYS,
  BaseSectionProps,
  BUTTON_STYLES,
  LoadingSpinner,
} from '../../components/Section.helpers'
import {
  FORM_FIELD_NAMES,
  LOADING_MESSAGES,
} from '../../constants/formConstants'

type YouTubeSectionProps = BaseSectionProps & {
  onFetchTranscript?: () => void
  canFetchTranscript?: boolean
}

export function YouTubeSection({
  isLoading,
  isTranscriptLoading,
  onFetchTranscript,
  canFetchTranscript,
  transcriptError,
}: YouTubeSectionProps) {
  return (
    <AnimatedSection
      isVisible
      delay={ANIMATION_DELAYS.section}
      className='space-y-8'>
      <SectionHeader
        icon={<Youtube className='w-6 h-6 text-white' />}
        title='Podaj Link z YouTube'
        subtitle='Wklej link do filmu YouTube lub zostaw puste, aby wkleić transkrypcję ręcznie'
        iconBgColor='bg-gradient-to-r from-red-500 to-red-600'
      />

      <div className='space-y-6'>
        <ControlledInput
          name={FORM_FIELD_NAMES.URL}
          placeholder='https://www.youtube.com/watch?v=...'
          disabled={isLoading || isTranscriptLoading}
          icon={<Youtube className='w-5 h-5' />}
          type='url'
          autoComplete='url'
        />

        {onFetchTranscript && (
          <div className='space-y-4'>
            <Button
              type='button'
              onClick={onFetchTranscript}
              disabled={!canFetchTranscript || isTranscriptLoading || isLoading}
              className={BUTTON_STYLES.youtubeFullWidth}>
              {isTranscriptLoading ? (
                <>
                  <LoadingSpinner className='w-5 h-5 mr-3' />
                  <span>{LOADING_MESSAGES.FETCHING_TRANSCRIPT}</span>
                </>
              ) : (
                <>
                  <Wand2 className='w-5 h-5 mr-3' />
                  <span>Wygeneruj Transkrypcję</span>
                </>
              )}
            </Button>

            {transcriptError && (
              <ErrorDisplay
                error={transcriptError}
                onRetry={onFetchTranscript}
                isRetrying={isTranscriptLoading}
                showBackButton={false}
              />
            )}
          </div>
        )}
      </div>
    </AnimatedSection>
  )
}
