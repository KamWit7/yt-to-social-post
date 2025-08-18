'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../../../Dashboard.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import type {
  TranscriptionFormData,
  TranscriptOnlyFormData,
} from '../../types/formTypes'
import { transcriptSchema } from './transcriptSchema'
import { TranscriptSection } from './TranscriptSection'

type TranscriptFormProps = {
  methods: UseFormReturn<TranscriptionFormData>
  isLoading: boolean
  isTranscriptLoading?: boolean
  stepKey?: DashboardTab
  transcriptError?: Error | null
  onFetchTranscript?: () => void
  onStepComplete?: (step: DashboardTab) => void
  onTabChange?: (tab: string) => void
}

export function TranscriptForm({
  methods,
  isLoading,
  isTranscriptLoading,
  stepKey = DASHBOARD_TABS.TRANSCRIPT,
  transcriptError,
  onFetchTranscript,
  onStepComplete,
  onTabChange,
}: TranscriptFormProps) {
  const localMethods = useForm<TranscriptOnlyFormData>({
    resolver: zodResolver(transcriptSchema),
    mode: 'onChange',
    defaultValues: {
      transcript:
        (methods.getValues(FORM_FIELD_NAMES.TRANSCRIPT) as string) || '',
    },
  })

  // Sync transcript from main form to local form when it changes (e.g., after fetch)
  const watchedTranscript = methods.watch(FORM_FIELD_NAMES.TRANSCRIPT)
  useEffect(() => {
    const mainTranscript = methods.getValues(
      FORM_FIELD_NAMES.TRANSCRIPT
    ) as string
    if (
      mainTranscript &&
      mainTranscript !== localMethods.getValues('transcript')
    ) {
      localMethods.setValue('transcript', mainTranscript)
    }
  }, [watchedTranscript, localMethods, methods])

  const goNextWithValidation = async () => {
    const isValid = await localMethods.trigger()
    if (!isValid) return
    const transcript = localMethods.getValues(
      FORM_FIELD_NAMES.TRANSCRIPT as 'transcript'
    )
    methods.setValue(FORM_FIELD_NAMES.TRANSCRIPT as 'transcript', transcript)
    onStepComplete?.(DASHBOARD_TABS.TRANSCRIPT)
    onTabChange?.(DASHBOARD_TABS.PURPOSE)
  }

  return (
    <FormProvider {...methods}>
      <form className='space-y-4'>
        <div className='space-y-12'>
          <FormProvider {...localMethods}>
            <TranscriptSection
              isLoading={isLoading}
              isTranscriptLoading={isTranscriptLoading}
              stepKey={stepKey}
              transcriptError={transcriptError}
              onFetchTranscript={onFetchTranscript}
              onStepComplete={() => goNextWithValidation()}
              onTabChange={() => goNextWithValidation()}
            />
          </FormProvider>
        </div>
      </form>
    </FormProvider>
  )
}
