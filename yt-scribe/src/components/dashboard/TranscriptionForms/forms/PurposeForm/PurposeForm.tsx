'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import { AILoadingAnimation, AnimatedSection } from '@/components/animation'
import { ControlledSelect, SubmitButton } from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import type { PurposeOnlyFormData } from '../../types/formTypes'
import { ConditionalOptions } from './ConditionalOptions'
import { PurposeDefaultValue } from './PurposeForm.helpers'
import { purposeSchema } from './purposeSchema'

type PurposeFormProps = {
  transcript?: string
  onSubmit?: () => void
  onLoadingStateChange?: (isLoading: boolean) => void
}

export function PurposeForm({
  transcript = '',
  onSubmit,
  onLoadingStateChange,
}: PurposeFormProps) {
  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )
  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data.map((item) => ({ label: item.label, value: item.code }))
    : []

  const {
    mutate: processAI,
    isPending: isAIProcessing,
    isSuccess,
  } = useAIProcessing()

  const localMethods = useForm<PurposeOnlyFormData>({
    resolver: zodResolver(purposeSchema),
    mode: 'onChange',
    defaultValues: PurposeDefaultValue,
  })

  const { handleSubmit, watch } = localMethods

  const purpose = watch(FORM_FIELD_NAMES.PURPOSE)

  const onFormSubmit = async (data: PurposeOnlyFormData) => {
    const completeData = {
      [FORM_FIELD_NAMES.TRANSCRIPT]: transcript,
      [FORM_FIELD_NAMES.PURPOSE]: data.purpose,
      [FORM_FIELD_NAMES.CUSTOM_PURPOSE]: data.customPurpose || '',
      options: data.options,
    }

    processAI(completeData)
  }

  useEffect(() => {
    if (!isSuccess || isPurposeLoading) {
      return
    }

    onSubmit?.()
  }, [isSuccess, onSubmit, isPurposeLoading])

  useEffect(() => {
    onLoadingStateChange?.(isAIProcessing)
  }, [isAIProcessing, onLoadingStateChange])

  if (isAIProcessing) {
    return <AILoadingAnimation />
  }

  return (
    <FormProvider {...localMethods}>
      <form className='space-y-4' onSubmit={handleSubmit(onFormSubmit)}>
        <div className='space-y-12'>
          <AnimatedSection
            isVisible
            delay={ANIMATION_DELAYS.section}
            className='space-y-8'>
            <SectionHeader
              icon={<Sparkles className='w-6 h-6 text-white' />}
              title='W jakim celu przetwarzasz transkrypcję?'
              subtitle='Wybierz cel przetwarzania i dostosuj opcje do swoich potrzeb'
              iconBgColor='bg-gradient-to-r from-purple-500 to-purple-600'
            />

            <div className='space-y-6'>
              <ControlledSelect
                name={FORM_FIELD_NAMES.PURPOSE}
                placeholder='Wybierz cel...'
                disabled={isPurposeLoading}
                required
                options={purposeOptions}
                className='sm:w-1/2'
              />

              <ConditionalOptions purpose={purpose} />

              <SubmitButton
                disabled={!purpose}
                isLoading={isAIProcessing}
                loadingText='Przetwarzam...'
                normalText='Przetwórz z AI'
                icon={Sparkles}
                className={BUTTON_STYLES.purposeFullWidth}
              />
            </div>
          </AnimatedSection>
        </div>
      </form>
    </FormProvider>
  )
}
