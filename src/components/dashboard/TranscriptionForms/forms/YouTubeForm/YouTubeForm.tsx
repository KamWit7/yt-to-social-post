'use client'

import { useTranscript } from '@/api/hooks/useTranscript'
import { AnimatedSection } from '@/components/animation'
import { ControlledInput, SubmitButton } from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { Wand2, Youtube } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { DASHBOARD_TABS } from '../../../Dashboard.helpers'
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import {
  FORM_FIELD_NAMES,
  LOADING_MESSAGES,
} from '../../TasncriptionForms.constants'
import { useTranscriptionForms } from '../../TranscriptionFormsContext'
import { YouTubeErrorDisplay } from './YouTubeErrorDisplay'
import { getYouTubeDefaultValues } from './YouTubeForm.helpers'
import { youtubeSchema, type YouTubeFormData } from './youtubeSchema'

export function YouTubeForm() {
  const {
    formStepsState,
    handleTranscriptChange,
    handleUrlChange,
    handleStepComplete,
    handleTabChange,
    handleLoadingStateChange,
  } = useTranscriptionForms()

  const contextUrl = formStepsState[DASHBOARD_TABS.YOUTUBE] || ''

  const methods = useForm<YouTubeFormData>({
    resolver: zodResolver(youtubeSchema),
    mode: 'onChange',
    defaultValues: getYouTubeDefaultValues(contextUrl),
  })

  const { watch, handleSubmit } = methods

  const url = watch(FORM_FIELD_NAMES.URL)

  const {
    data: transcriptData,
    isLoading: isTranscriptLoading,
    isFetching: isTranscriptFetching,
    error: transcriptError,
    refetch: refetchTranscript,
  } = useTranscript(url, {
    enabled: false,
    retry: 2,
  })

  useEffect(() => {
    handleLoadingStateChange(isTranscriptFetching)
  }, [isTranscriptFetching, handleLoadingStateChange])

  const onSubmitForm = async () => {
    handleUrlChange(url)

    const { isSuccess, data: transcriptData } = await refetchTranscript()

    if (isSuccess && transcriptData?.data?.transcript) {
      handleTranscriptChange(transcriptData.data.transcript)
      handleStepComplete(DASHBOARD_TABS.YOUTUBE)
      handleTabChange(DASHBOARD_TABS.TRANSCRIPT)
    }
  }

  return (
    <FormProvider {...methods}>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmitForm)}>
        <div className='space-y-12'>
          <AnimatedSection
            isVisible
            delay={ANIMATION_DELAYS.section}
            className='space-y-8'>
            <SectionHeader
              icon={<Youtube className='w-6 h-6 text-white' />}
              title='Podaj Link z YouTube'
              subtitle='wklej link do filmu YouTube, aby wygenerować transkrypcję'
              iconBgColor='bg-gradient-to-r from-red-500 to-red-600'
            />

            <div className='space-y-6'>
              <ControlledInput
                name={FORM_FIELD_NAMES.URL}
                placeholder='https://www.youtube.com/watch?v=...'
                disabled={isTranscriptLoading}
                icon={<Youtube className='w-5 h-5' />}
                type='url'
                autoComplete='url'
              />

              <SubmitButton
                disabled={!url}
                isLoading={isTranscriptFetching}
                loadingText={LOADING_MESSAGES.FETCHING_TRANSCRIPT}
                normalText='Wygeneruj Transkrypcję'
                icon={Wand2}
                className={BUTTON_STYLES.youtubeFullWidth}
              />

              {(transcriptError || transcriptData?.error) && (
                <YouTubeErrorDisplay
                  error={transcriptError}
                  errorMessage={
                    transcriptData?.error || transcriptError?.message || ''
                  }
                  onRetry={refetchTranscript}
                  isRetrying={isTranscriptLoading}
                />
              )}
            </div>
          </AnimatedSection>
        </div>
      </form>
    </FormProvider>
  )
}
