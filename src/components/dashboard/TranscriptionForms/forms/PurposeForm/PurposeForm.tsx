'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import { AILoadingAnimation, AnimatedSection } from '@/components/animation'
import { ControlledSelect, SubmitButton } from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import {
  AIModels,
  DEFAULT_AI_MODEL,
  DEFAULT_LANGUAGE,
  type AIProcessingRequest,
} from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { trackUserUsage } from '@/lib/actions/updateUsage'
import { DASHBOARD_TABS } from '../../../Dashboard.helpers'
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../constants/formConstants'
import { useTranscriptionForms } from '../../context'
import type { PurposeOnlyFormData } from '../../types/formTypes'
import { ConditionalOptions } from './ConditionalOptions'
import { PurposeDefaultValue } from './PurposeForm.helpers'
import { purposeSchema } from './purposeSchema'

export function PurposeForm() {
  const {
    transcript,
    handleStepComplete,
    handleTabChange,
    handleLoadingStateChange,
  } = useTranscriptionForms()

  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )
  const { data: languageDict, isLoading: isLanguageLoading } = useDictionary(
    DictionaryCode.Language
  )

  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data.map((item) => ({ label: item.label, value: item.code }))
    : []

  const languageOptions = Array.isArray(languageDict?.data)
    ? languageDict.data.map((item) => ({ label: item.label, value: item.code }))
    : []

  const {
    mutate: processAI,
    isPending: isAIProcessing,
    isSuccess,
  } = useAIProcessing(transcript)

  const localMethods = useForm<PurposeOnlyFormData>({
    resolver: zodResolver(purposeSchema),
    mode: 'onChange',
    defaultValues: PurposeDefaultValue,
  })

  const { handleSubmit, watch } = localMethods

  const purpose = watch(FORM_FIELD_NAMES.PURPOSE)

  const onFormSubmit = async (data: PurposeOnlyFormData) => {
    const rawPrompt = data.customPrompt ?? ''

    const completeData: AIProcessingRequest = {
      transcript,
      purpose: data.purpose,
      language: data.language || DEFAULT_LANGUAGE,
      customPrompt: rawPrompt.trim(),
      model: data.model || DEFAULT_AI_MODEL,
    }

    processAI(completeData)
  }

  useEffect(() => {
    if (!isSuccess || isPurposeLoading) {
      return
    }

    handleStepComplete(DASHBOARD_TABS.PURPOSE)
    handleStepComplete(DASHBOARD_TABS.RESULTS)
    handleTabChange(DASHBOARD_TABS.RESULTS)

    trackUserUsage()
  }, [isSuccess, handleStepComplete, handleTabChange, isPurposeLoading])

  useEffect(() => {
    handleLoadingStateChange(isAIProcessing)
  }, [isAIProcessing, handleLoadingStateChange])

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

            <div className='space-y-8'>
              {/* Enhanced Selector Section with Visual Hierarchy */}
              <div className='bg-gradient-to-br from-white/5 to-purple-50/10 backdrop-blur-sm rounded-xl border-2 border-gray-200 dark:border-gray-700 p-6'>
                <div className='mb-4'>
                  <h3 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2'>
                    <div className='w-2 h-2 bg-purple-500 rounded-full'></div>
                    Ustawienia przetwarzania
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Dostosuj parametry do swoich potrzeb
                  </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                  {/* Purpose Selector */}
                  <div className='space-y-2'>
                    <ControlledSelect
                      name={FORM_FIELD_NAMES.PURPOSE}
                      label='📝 Typ treści'
                      placeholder='Wybierz cel...'
                      disabled={isPurposeLoading}
                      required
                      options={purposeOptions}
                      className='w-full'
                    />
                  </div>

                  {/* Language Selector */}
                  <div className='space-y-2'>
                    <ControlledSelect
                      name={FORM_FIELD_NAMES.LANGUAGE}
                      label='🌍 Język'
                      placeholder='Wybierz język...'
                      disabled={isLanguageLoading}
                      required
                      options={languageOptions}
                      className='w-full'
                    />
                  </div>

                  {/* Model Selector */}
                  <div className='space-y-2'>
                    <ControlledSelect
                      name={FORM_FIELD_NAMES.MODEL}
                      label='🤖 Model AI'
                      placeholder='Wybierz model...'
                      required
                      options={[
                        {
                          label: AIModels.Gemini25Pro,
                          value: AIModels.Gemini25Pro,
                        },
                        {
                          label: AIModels.Gemini25Flash,
                          value: AIModels.Gemini25Flash,
                        },
                        {
                          label: AIModels.Gemini25FlashLite,
                          value: AIModels.Gemini25FlashLite,
                        },
                      ]}
                      className='w-full'
                    />
                  </div>
                </div>
              </div>

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
