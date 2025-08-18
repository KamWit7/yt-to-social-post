'use client'
import { getAIProcessingQueryKey } from '@/api/hooks/useAIProcessing'
import { AILoadingAnimation } from '@/components/animation'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { useCachedMutation } from '@/hooks/useCachedMutation'
import { AIProcessingResponse, ApiResponse } from '@/types'
import { AnimatePresence } from 'framer-motion'
import { Brain, FileText, Sparkles, Youtube } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import {
  DASHBOARD_TABS,
  type DashboardTab,
  type StepCompleted,
} from './Dashboard.helpers'
import TranscriptionForm from './TranscriptionForm/TranscriptionForm'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'
import { AnimatedTabContent, DashboardTabTrigger } from './components'

export default function Dashboard({
  setIsLoading,
}: {
  setIsLoading: (isLoading: boolean) => void
}) {
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    DASHBOARD_TABS.YOUTUBE
  )

  // Track completion of each step
  const [stepCompleted, setStepCompleted] = useState<StepCompleted>({
    youtube: false, // Step 1: URL entered and transcript fetched
    transcript: false, // Step 2: Transcript edited and "Next step" clicked
    purpose: false, // Step 3: Purpose selected and "Process with AI" clicked
    results: false, // Step 4: AI processing completed
  })

  // Derive AI processing loading/data from mutation cache (source of truth)
  const { isLoading: isAIProcessingLoading, data: aiData } = useCachedMutation<
    ApiResponse<AIProcessingResponse>
  >(getAIProcessingQueryKey())

  useEffect(() => {
    if (aiData?.success && aiData.data) {
      setStepCompleted((prev) => ({ ...prev, results: true }))
    }
  }, [aiData])

  useEffect(() => {
    setIsLoading(isAIProcessingLoading)
  }, [isAIProcessingLoading, setIsLoading])

  const handleTranscriptChange = (transcript: string) => {
    setCurrentTranscript(transcript)
    // Mark YouTube step as completed when transcript is available
    if (transcript && transcript.trim().length > 0) {
      setStepCompleted((prev) => ({ ...prev, youtube: true }))
    } else {
      setStepCompleted((prev) => ({ ...prev, youtube: false }))
    }
  }

  const handleAIProcessingStart = () => {
    setActiveTab(DASHBOARD_TABS.RESULTS)
    // Mark purpose step as completed
    setStepCompleted((prev) => ({ ...prev, purpose: true }))
  }

  const handleStepComplete = (step: keyof StepCompleted) => {
    setStepCompleted((prev) => ({ ...prev, [step]: true }))
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as DashboardTab)
  }

  const tabConfigs = [
    {
      value: DASHBOARD_TABS.YOUTUBE,
      icon: Youtube,
      label: 'YouTube Link',
      disabled: isAIProcessingLoading,
      stepKey: DASHBOARD_TABS.YOUTUBE,
    },
    {
      value: DASHBOARD_TABS.TRANSCRIPT,
      icon: FileText,
      label: 'Transkrypcja',
      disabled: !stepCompleted.youtube || isAIProcessingLoading,
      stepKey: DASHBOARD_TABS.TRANSCRIPT,
    },
    {
      value: DASHBOARD_TABS.PURPOSE,
      icon: Sparkles,
      label: 'Cel',
      disabled: !stepCompleted.transcript || isAIProcessingLoading,
      stepKey: DASHBOARD_TABS.PURPOSE,
    },
    {
      value: DASHBOARD_TABS.RESULTS,
      icon: Brain,
      label: 'Wyniki',
      disabled: !stepCompleted.purpose,
      stepKey: DASHBOARD_TABS.RESULTS,
    },
  ]

  return (
    <Fragment>
      <Card className='bg-white/60 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200/60 dark:border-gray-800/60 mb-8'>
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className='w-full'>
          <TabsList className='grid w-full grid-cols-4 mb-8'>
            {tabConfigs.map((config) => (
              <DashboardTabTrigger
                key={config.value}
                config={config}
                stepCompleted={stepCompleted[config.stepKey]}
              />
            ))}
          </TabsList>

          <AnimatePresence mode='wait'>
            {[
              DASHBOARD_TABS.YOUTUBE,
              DASHBOARD_TABS.TRANSCRIPT,
              DASHBOARD_TABS.PURPOSE,
              DASHBOARD_TABS.RESULTS,
            ].map((tab) => (
              <AnimatedTabContent key={tab} value={tab}>
                <TranscriptionForm
                  onTranscriptChange={handleTranscriptChange}
                  onTabChange={handleTabChange}
                  onAIProcessingStart={handleAIProcessingStart}
                  onStepComplete={handleStepComplete}
                  externalTranscript={currentTranscript}
                  stepKey={tab}
                />
              </AnimatedTabContent>
            ))}

            <AnimatedTabContent value={DASHBOARD_TABS.RESULTS}>
              {isAIProcessingLoading ? (
                <AILoadingAnimation />
              ) : (
                <TranscriptionResults
                  transcript={currentTranscript}
                  onTranscriptChange={handleTranscriptChange}
                />
              )}
            </AnimatedTabContent>
          </AnimatePresence>
        </Tabs>
      </Card>
    </Fragment>
  )
}
