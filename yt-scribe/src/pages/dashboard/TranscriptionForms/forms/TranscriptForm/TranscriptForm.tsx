'use client'

import { AnimatedSection } from '@/components/animation'
import {
  ControlledTextarea,
  CopyButton,
  SubmitButton,
} from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, FileText } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import type { TranscriptOnlyFormData } from '../../types/formTypes'
import { getTranscriptDefaultValues } from './TranscriptForm.helpers'
import { transcriptSchema } from './transcriptSchema'

type TranscriptFormProps = {
  transcript?: string
  onSubmit?: () => void
  onLoadingStateChange?: (isLoading: boolean) => void
}

export function TranscriptForm({
  transcript = '',
  onSubmit,
  onLoadingStateChange,
}: TranscriptFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const localMethods = useForm<TranscriptOnlyFormData>({
    resolver: zodResolver(transcriptSchema),
    mode: 'onChange',
    defaultValues: getTranscriptDefaultValues(transcript),
  })

  const { handleSubmit: handleFormSubmit, watch } = localMethods

  const watchedTranscript = watch(FORM_FIELD_NAMES.TRANSCRIPT)

  // Update form when transcript prop changes
  useEffect(() => {
    if (
      transcript &&
      transcript !== localMethods.getValues(FORM_FIELD_NAMES.TRANSCRIPT)
    ) {
      localMethods.setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcript)
    }
  }, [transcript, localMethods])

  useEffect(() => {
    onLoadingStateChange?.(isSubmitting)
  }, [isSubmitting, onLoadingStateChange])

  // Check if transcript is available
  const hasTranscript = Boolean(
    watchedTranscript && watchedTranscript.trim().length > 0
  )

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onSubmit?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FormProvider {...localMethods}>
      <form className='space-y-4' onSubmit={handleFormSubmit(handleSubmit)}>
        <div className='space-y-12'>
          <AnimatedSection
            isVisible
            delay={ANIMATION_DELAYS.section}
            className='space-y-8'>
            <SectionHeader
              icon={<FileText className='w-6 h-6 text-white' />}
              title='Przygotuj Transkrypcję'
              subtitle='Edytuj transkrypcję i wybierz cel jej przetwarzania'
              iconBgColor='bg-gradient-to-r from-blue-500 to-blue-600'
            />

            <div className='space-y-6'>
              <div className='relative'>
                <div className='flex items-center justify-between mb-2'>
                  <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                    Transkrypcja
                    <span className='text-red-500 ml-1'>*</span>
                  </label>

                  {hasTranscript && (
                    <CopyButton
                      text={watchedTranscript || ''}
                      aria-label='Kopiuj transkrypcję'
                    />
                  )}
                </div>

                <ControlledTextarea
                  name={FORM_FIELD_NAMES.TRANSCRIPT}
                  placeholder='Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...'
                  required
                  rows={8}
                  textareaClassName='max-h-[300px] overflow-y-auto'
                />
              </div>

              <SubmitButton
                disabled={!hasTranscript}
                isLoading={isSubmitting}
                loadingText='Przechodzę...'
                normalText='Następny krok'
                icon={ArrowRight}
                className={BUTTON_STYLES.transcriptFullWidth}
              />
            </div>
          </AnimatedSection>
        </div>
      </form>
    </FormProvider>
  )
}
