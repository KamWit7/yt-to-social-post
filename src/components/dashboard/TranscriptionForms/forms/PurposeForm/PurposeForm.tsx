'use client'

import { AnimatedSection } from '@/components/animation'
import { ControlledSelect, SubmitButton } from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import { AIModels, DEFAULT_AI_MODEL, DEFAULT_LANGUAGE } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { Sparkles } from 'lucide-react'
import { FormProvider, useForm } from 'react-hook-form'

import { Dictionary, DictionaryDisplay } from '@/app/api/dictionaries'
import { ProcessTranscriptRequest } from '@/app/api/result/ai.validations'
import { DASHBOARD_TABS } from '../../../Dashboard.helpers'
import {
  ANIMATION_DELAYS,
  BUTTON_STYLES,
} from '../../components/Section.helpers'
import {
  DEFAULT_PURPOSE,
  FORM_FIELD_NAMES,
} from '../../constants/formConstants'
import { useTranscriptionForms } from '../../context'
import type { PurposeOnlyFormData } from '../../types/formTypes'
import { ConditionalOptions } from './ConditionalOptions'
import { getPurposeDefaultValues } from './PurposeForm.helpers'
import { purposeSchema } from './purposeSchema'

export function PurposeForm() {
  const {
    formStepsState,
    handleStepComplete,
    handleTabChange,
    handleFormStepUpdate,
    aiProcessing,
  } = useTranscriptionForms()

  const existingPurposeData = formStepsState[DASHBOARD_TABS.PURPOSE]

  const purposeOptions = DictionaryDisplay.Purpose.map((item) => ({
    label: item.label,
    value: item.code,
  }))

  const languageOptions = DictionaryDisplay.Language.map((item) => ({
    label: item.label,
    value: item.code,
  }))

  const localMethods = useForm<PurposeOnlyFormData>({
    resolver: zodResolver(purposeSchema),
    mode: 'onChange',
    defaultValues: getPurposeDefaultValues(existingPurposeData),
  })

  const { handleSubmit, watch } = localMethods

  const purpose = watch(FORM_FIELD_NAMES.PURPOSE)

  const onFormSubmit = async (data: PurposeOnlyFormData) => {
    handleFormStepUpdate(DASHBOARD_TABS.PURPOSE, data)

    handleStepComplete(DASHBOARD_TABS.PURPOSE)
    handleStepComplete(DASHBOARD_TABS.RESULTS)
    handleTabChange(DASHBOARD_TABS.RESULTS)

    const { processTranscript, reset } = aiProcessing

    const completeData: ProcessTranscriptRequest = {
      transcript: formStepsState[DASHBOARD_TABS.TRANSCRIPT] || '',
      purpose: data.purpose || DEFAULT_PURPOSE,
      language: data.language || DEFAULT_LANGUAGE,
      customPrompt: data.customPrompt || '',
      model: data.model || DEFAULT_AI_MODEL,
    }
    
    reset()

    const fetchData = async () => {
      try {
        await Promise.all([
          processTranscript(completeData.purpose, completeData),
          processTranscript(Dictionary.Purpose.Summary, completeData),
          processTranscript(Dictionary.Purpose.Topics, completeData),
        ])
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    await fetchData()
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
                  <div className='space-y-2'>
                    <ControlledSelect
                      name={FORM_FIELD_NAMES.PURPOSE}
                      label='📝 Typ treści'
                      placeholder='Wybierz cel...'
                      disabled={false}
                      required
                      options={purposeOptions}
                      className='w-full'
                    />
                  </div>

                  <div className='space-y-2'>
                    <ControlledSelect
                      name={FORM_FIELD_NAMES.LANGUAGE}
                      label='🌍 Język'
                      placeholder='Wybierz język...'
                      disabled={false}
                      required
                      options={languageOptions}
                      className='w-full'
                    />
                  </div>

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
