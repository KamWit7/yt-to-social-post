'use client'

import {
  AIProcessingV2Response,
  isAnyPurposeLoading,
  isAnyPurposeSuccess,
} from '@/api/hooks/useAIProcessingV2'
import { Dictionary } from '@/app/api/dictionaries'
import { AILoadingAnimation } from '@/components/animation'
import { useUsage } from '@/context'
import { trackUserUsage } from '@/lib/actions/usage'
import { MindMapData } from '@/types'
import { FileText, Hash, MessageSquare } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { DASHBOARD_TABS } from '../Dashboard.helpers'
import { useTranscriptionForms } from '../TranscriptionForms/context'
import { ResultCard } from './components'

// Helper function to extract data from AIProcessingV2Response record
function extractDataFromResponse(response?: AIProcessingV2Response) {
  const result: {
    summary?: string
    topics?: string
    socialPost?: string
    customOutput?: string
    mindMap?: MindMapData | Record<string, unknown>
  } = {}

  if (!response) {
    return result
  }

  Object.entries(response).forEach(([key, value]) => {
    switch (key) {
      case Dictionary.Purpose.Summary:
        result.summary = value
        break
      case Dictionary.Purpose.Topics:
        result.topics = value
        break
      case Dictionary.Purpose.SocialMedia:
        result.socialPost = value
        break
      case Dictionary.Purpose.Custom:
        result.customOutput = value
        break
      default:
        break
    }
  })

  return result
}

export default function TranscriptionResults() {
  const { formStepsState, handleLoadingStateChange, aiProcessing } =
    useTranscriptionForms()

  const { refreshUsage } = useUsage()

  const purposeData = useMemo(
    () => formStepsState[DASHBOARD_TABS.PURPOSE],
    [formStepsState]
  )

  const {
    isLoading: aiLoading,
    isSuccess: aiSuccess,
    response: aiResponse,
    error: aiError,
  } = aiProcessing

  useEffect(() => {
    if (!isAnyPurposeLoading(aiLoading) && isAnyPurposeSuccess(aiSuccess)) {
      trackUserUsage()
      refreshUsage()
    }
  }, [aiSuccess, aiLoading, refreshUsage])

  useEffect(() => {
    handleLoadingStateChange(isAnyPurposeLoading(aiLoading))
  }, [aiLoading, handleLoadingStateChange])

  if (isAnyPurposeLoading(aiLoading) && !aiResponse) {
    return <AILoadingAnimation />
  }

  const extractedData = extractDataFromResponse(aiResponse)

  return (
    <div className='flex flex-row gap-4 sm:flex-col lg:flex-row'>
      <div className='flex flex-col gap-4 w-full lg:w-lg'>
        <ResultCard
          sectionName='Kluczowe tematy'
          title='Kluczowe tematy'
          content={extractedData.topics || ''}
          icon={Hash}
          purpose={Dictionary.Purpose.Topics}
          aiErrors={aiError}
          ariaLabel='Kopiuj tematy'
          purposeData={purposeData}
          aiLoading={aiLoading}
          className='flex-0 min-h-[400px]'
        />
        <ResultCard
          sectionName='Streszczenie'
          title='Streszczenie'
          content={extractedData.summary || ''}
          icon={FileText}
          purpose={Dictionary.Purpose.Summary}
          aiErrors={aiError}
          ariaLabel='Kopiuj streszczenie'
          purposeData={purposeData}
          aiLoading={aiLoading}
          className='max-h-[calc(500px-16px)]'
        />
      </div>

      <ResultCard
        sectionName='Post na social media'
        title='Post na social media'
        content={extractedData.socialPost || ''}
        icon={MessageSquare}
        purpose={Dictionary.Purpose.SocialMedia}
        aiErrors={aiError}
        ariaLabel='Kopiuj post na social media'
        purposeData={purposeData}
        aiLoading={aiLoading}
        className='max-h-[500px] w-lg'
      />

      <ResultCard
        sectionName='Wynik własnego polecenia'
        title='Wynik własnego polecenia'
        content={extractedData.customOutput || ''}
        icon={FileText}
        purpose={Dictionary.Purpose.Custom}
        aiErrors={aiError}
        ariaLabel='Kopiuj wynik własnego polecenia'
        purposeData={purposeData}
        aiLoading={aiLoading}
        className='max-h-[900px]'
      />
    </div>
  )
}
