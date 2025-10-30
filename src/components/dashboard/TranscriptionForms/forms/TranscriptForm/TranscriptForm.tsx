'use client'

import { AnimatedSection } from '@/components/animation'
import {
  ControlledTextarea,
  CopyButton,
  SubmitButton,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/ui/SectionHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, FileText, Save, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { DASHBOARD_TABS } from '../../../Dashboard.helpers'
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../TasncriptionForms.constants'
import { useTranscriptionForms } from '../../TranscriptionFormsContext'
import { getTranscriptDefaultValues } from './TranscriptForm.helpers'
import {
  transcriptSchema,
  type TranscriptOnlyFormData,
} from './transcriptSchema'

export function TranscriptForm() {
  const {
    formStepsState,
    handleStepComplete,
    handleTabChange,
    handleLoadingStateChange,
    handleTranscriptUpdate,
  } = useTranscriptionForms()

  const transcript = formStepsState[DASHBOARD_TABS.TRANSCRIPT] || ''

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const localMethods = useForm<TranscriptOnlyFormData>({
    resolver: zodResolver(transcriptSchema),
    mode: 'onChange',
    defaultValues: getTranscriptDefaultValues(transcript),
  })

  const { handleSubmit: handleFormSubmit, watch } = localMethods

  useEffect(() => {
    if (
      transcript &&
      transcript !== localMethods.getValues(FORM_FIELD_NAMES.TRANSCRIPT)
    ) {
      localMethods.setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcript)
      setHasUnsavedChanges(false)
    }
  }, [transcript, localMethods])

  const handleTextareaChange = (newValue: string) => {
    const hasChanges = newValue !== transcript
    setHasUnsavedChanges(hasChanges)
  }

  useEffect(() => {
    handleLoadingStateChange(isSubmitting)
  }, [isSubmitting, handleLoadingStateChange])

  const currentTranscriptValue = watch(FORM_FIELD_NAMES.TRANSCRIPT) || ''
  const hasTranscript = Boolean(currentTranscriptValue.trim().length > 0)

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 400))
      handleStepComplete(DASHBOARD_TABS.TRANSCRIPT)
      handleTabChange(DASHBOARD_TABS.PURPOSE)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setHasUnsavedChanges(false)
    handleTranscriptUpdate(currentTranscriptValue)
  }

  const handleCancelChanges = () => {
    localMethods.setValue(FORM_FIELD_NAMES.TRANSCRIPT, transcript)
    setHasUnsavedChanges(false)
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
              subtitle='edytuj transkrypcję, jeżeli tego potrzebujesz'
              iconBgColor='bg-gradient-to-r from-blue-500 to-blue-600'
            />

            <div>
              <ControlledTextarea
                name={FORM_FIELD_NAMES.TRANSCRIPT}
                placeholder='Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...'
                label={
                  <div className='flex items-center justify-between w-full'>
                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                      transkrypcja
                      <span className='text-red-500 ml-1'>*</span>
                    </label>

                    {hasTranscript && (
                      <CopyButton
                        text={currentTranscriptValue}
                        aria-label='Kopiuj transkrypcję'
                      />
                    )}
                  </div>
                }
                rows={8}
                textareaClassName='max-h-[342px] overflow-y-auto'
                onChange={handleTextareaChange}
              />

              <AnimatedSection
                isVisible={hasUnsavedChanges}
                delay={ANIMATION_DELAYS.content}>
                <div className='flex items-center bg-gradient-to-r p-4 from-slate-50 to-blue-50 rounded-xl border border-slate-200 shadow-sm mt-6'>
                  <div className='flex-1'>
                    <p className='text-sm text-slate-700 dark:text-slate-300 font-medium'>
                      Masz niezapisane zmiany w transkrypcji
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      variant='outline'
                      onClick={handleCancelChanges}
                      className={cn(
                        'flex-1',
                        isSubmitting && 'opacity-50 cursor-not-allowed'
                      )}>
                      <X className='w-4 h-4' />
                      Anuluj
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className={cn(
                        'flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
                        isSubmitting && 'opacity-50 cursor-not-allowed'
                      )}>
                      <Save className='w-4 h-4' />
                      Zapisz
                    </Button>
                  </div>
                </div>
              </AnimatedSection>

              <div className='pt-6' />

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
