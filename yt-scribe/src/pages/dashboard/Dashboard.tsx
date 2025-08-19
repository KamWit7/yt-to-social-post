'use client'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { AnimatePresence } from 'framer-motion'
import { Brain, FileText, Sparkles, Youtube } from 'lucide-react'
import { Fragment, useCallback, useMemo, useState } from 'react'
import { TranscriptionForm } from '.'
import {
  DASHBOARD_TABS,
  type DashboardTab,
  type StepCompleted,
} from './Dashboard.helpers'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'
import { AnimatedTabContent, DashboardTabTrigger } from './components'

export default function Dashboard({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}) {
  const [transcript, setTranscript] = useState('')

  const [activeTab, setActiveTab] = useState<DashboardTab>(
    DASHBOARD_TABS.YOUTUBE
  )
  const [stepCompleted, setStepCompleted] = useState<StepCompleted>({
    [DASHBOARD_TABS.YOUTUBE]: false,
    [DASHBOARD_TABS.TRANSCRIPT]: false,
    [DASHBOARD_TABS.PURPOSE]: false,
    [DASHBOARD_TABS.RESULTS]: false,
  })

  const handleTranscriptChange = useCallback((newTranscript: string) => {
    setTranscript(newTranscript)

    if (newTranscript && newTranscript.trim().length > 0) {
      setStepCompleted((prev) => ({ ...prev, youtube: true }))
    } else {
      setStepCompleted((prev) => ({ ...prev, youtube: false }))
    }
  }, [])

  const handleTranscriptUpdate = useCallback((updatedTranscript: string) => {
    setTranscript(updatedTranscript)
    // Keep the youtube step completed status since transcript exists
    if (updatedTranscript && updatedTranscript.trim().length > 0) {
      setStepCompleted({
        [DASHBOARD_TABS.YOUTUBE]: true,
        [DASHBOARD_TABS.TRANSCRIPT]: false,
        [DASHBOARD_TABS.PURPOSE]: false,
        [DASHBOARD_TABS.RESULTS]: false,
      })
    }
  }, [])

  const handleStepComplete = useCallback((step: keyof StepCompleted) => {
    setStepCompleted((prev) => ({ ...prev, [step]: true }))
  }, [])

  const handleLoadingStateChange = useCallback(
    (loading: boolean) => {
      setIsLoading(loading)
    },
    [setIsLoading]
  )

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value as DashboardTab)
  }, [])

  const tabConfigs = useMemo(
    () => [
      {
        value: DASHBOARD_TABS.YOUTUBE,
        icon: Youtube,
        label: 'YouTube Link',
        disabled: isLoading,
      },
      {
        value: DASHBOARD_TABS.TRANSCRIPT,
        icon: FileText,
        label: 'Transkrypcja',
        disabled: isLoading || !stepCompleted[DASHBOARD_TABS.YOUTUBE],
      },
      {
        value: DASHBOARD_TABS.PURPOSE,
        icon: Sparkles,
        label: 'Cel',
        disabled: isLoading || !stepCompleted[DASHBOARD_TABS.TRANSCRIPT],
      },
      {
        value: DASHBOARD_TABS.RESULTS,
        icon: Brain,
        label: 'Wyniki',
        disabled: isLoading || !stepCompleted[DASHBOARD_TABS.PURPOSE],
      },
    ],
    [stepCompleted, isLoading]
  )

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
                stepCompleted={stepCompleted[config.value]}
              />
            ))}
          </TabsList>

          <AnimatePresence mode='wait'>
            {tabConfigs.map((tab) => (
              <AnimatedTabContent key={tab.value} value={tab.value}>
                <TranscriptionForm
                  transcript={transcript}
                  onTranscriptChange={handleTranscriptChange}
                  onTabChange={handleTabChange}
                  onStepComplete={handleStepComplete}
                  onLoadingStateChange={handleLoadingStateChange}
                  onTranscriptUpdate={handleTranscriptUpdate}
                  stepKey={tab.value}
                />
              </AnimatedTabContent>
            ))}

            <AnimatedTabContent value={DASHBOARD_TABS.RESULTS}>
              <TranscriptionResults transcript={transcript} />
            </AnimatedTabContent>
          </AnimatePresence>
        </Tabs>
      </Card>
    </Fragment>
  )
}
