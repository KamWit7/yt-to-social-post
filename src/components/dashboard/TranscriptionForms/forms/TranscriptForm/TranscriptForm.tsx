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

import { DASHBOARD_TABS } from '../../../Dashboard.helpers'
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import { useTranscriptionForms } from '../../context'
import type { TranscriptOnlyFormData } from '../../types/formTypes'
import { getTranscriptDefaultValues } from './TranscriptForm.helpers'
import { transcriptSchema } from './transcriptSchema'

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
      await new Promise((resolve) => setTimeout(resolve, 1000))
      handleStepComplete(DASHBOARD_TABS.TRANSCRIPT)
      handleTabChange(DASHBOARD_TABS.PURPOSE)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveChanges = () => {
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
              subtitle='Edytuj transkrypcję jeżeli tego potrzebujesz'
              iconBgColor='bg-gradient-to-r from-blue-500 to-blue-600'
            />

            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
                  Transkrypcja
                  <span className='text-red-500 ml-1'>*</span>
                </label>

                {hasTranscript && (
                  <CopyButton
                    text={currentTranscriptValue}
                    aria-label='Kopiuj transkrypcję'
                  />
                )}
              </div>

              <ControlledTextarea
                name={FORM_FIELD_NAMES.TRANSCRIPT}
                placeholder='Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...'
                required
                rows={8}
                textareaClassName='max-h-[300px] overflow-y-auto mb-6'
                onChange={handleTextareaChange}
              />

              <AnimatedSection
                isVisible={hasUnsavedChanges}
                delay={ANIMATION_DELAYS.content}>
                <div className='flex items-center bg-gradient-to-r p-4 from-slate-50 to-blue-50 dark:from-slate-800/40 dark:to-blue-900/30 rounded-xl border border-slate-200 dark:border-slate-600/50 shadow-sm'>
                  <div className='flex-1'>
                    <p className='text-sm text-slate-700 dark:text-slate-300 font-medium'>
                      Masz niezapisane zmiany w transkrypcji
                    </p>
                  </div>
                  <div className='flex items-center gap-3'>
                    <Button
                      type='button'
                      onClick={handleCancelChanges}
                      className='flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:from-slate-300 hover:to-slate-400 dark:hover:from-slate-500 dark:hover:to-slate-600 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-base'>
                      <X className='w-4 h-4' />
                      Anuluj
                    </Button>
                    <Button
                      type='button'
                      onClick={handleSaveChanges}
                      className='flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 text-base'>
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
