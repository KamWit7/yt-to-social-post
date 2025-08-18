'use client'

import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm, UseFormReturn } from 'react-hook-form'
import { DASHBOARD_TABS, type DashboardTab } from '../../../Dashboard.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import type {
  PurposeOnlyFormData,
  TranscriptionFormData,
} from '../../types/formTypes'
import { purposeSchema } from './purposeSchema'
import { PurposeSection } from './PurposeSection'

type PurposeFormProps = {
  methods: UseFormReturn<TranscriptionFormData>
  isLoading: boolean
  isTranscriptLoading?: boolean
  stepKey?: DashboardTab
  transcriptError?: Error | null
  onFetchTranscript?: () => void
  onStepComplete?: (step: DashboardTab) => void
  onTabChange?: (tab: string) => void
  onSubmit: (data: TranscriptionFormData) => void
}

export function PurposeForm({
  methods,
  isLoading,
  isTranscriptLoading,
  stepKey = DASHBOARD_TABS.PURPOSE,
  transcriptError,
  onFetchTranscript,
  onStepComplete,
  onTabChange,
  onSubmit,
}: PurposeFormProps) {
  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )
  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data.map((item) => ({ label: item.label, value: item.code }))
    : []

  const localMethods = useForm<PurposeOnlyFormData>({
    resolver: zodResolver(purposeSchema),
    mode: 'onChange',
    defaultValues: {
      purpose: (methods.getValues(FORM_FIELD_NAMES.PURPOSE) as string) || '',
      customPurpose:
        (methods.getValues(FORM_FIELD_NAMES.CUSTOM_PURPOSE) as string) || '',
      options: methods.getValues('options') as PurposeOnlyFormData['options'],
    },
  })

  const processWithValidation = async () => {
    const isValid = await localMethods.trigger()
    if (!isValid) return
    const values = localMethods.getValues()
    methods.setValue(FORM_FIELD_NAMES.PURPOSE as 'purpose', values.purpose)
    methods.setValue(
      FORM_FIELD_NAMES.CUSTOM_PURPOSE as 'customPurpose',
      values.customPurpose || ''
    )
    methods.setValue('options', values.options)
    onStepComplete?.(DASHBOARD_TABS.PURPOSE)
    onTabChange?.(DASHBOARD_TABS.RESULTS)
    onSubmit(methods.getValues() as TranscriptionFormData)
  }

  return (
    <FormProvider {...methods}>
      <form className='space-y-4'>
        <div className='space-y-12'>
          <FormProvider {...localMethods}>
            <PurposeSection
              isLoading={isLoading}
              isTranscriptLoading={isTranscriptLoading}
              isPurposeLoading={isPurposeLoading}
              stepKey={stepKey}
              purposeOptions={purposeOptions}
              transcriptError={transcriptError}
              onFetchTranscript={onFetchTranscript}
              onStepComplete={() => undefined}
              onTabChange={() => undefined}
              onSubmit={() => processWithValidation()}
            />
          </FormProvider>
        </div>
      </form>
    </FormProvider>
  )
}
