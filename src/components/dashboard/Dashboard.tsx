'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { AnimatePresence } from 'framer-motion'
import { Brain, FileText, Sparkles, Youtube } from 'lucide-react'
import { Fragment, useMemo } from 'react'
import { TranscriptionForm } from '.'
import { AnimatedTabContent, DashboardTabTrigger } from './components'
import { DASHBOARD_TABS } from './Dashboard.helpers'
import {
  TranscriptionFormsProvider,
  useTranscriptionForms,
} from './TranscriptionForms/context'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'

function DashboardContent() {
  const { transcript, activeTab, stepCompleted, isLoading, handleTabChange } =
    useTranscriptionForms()

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
              <TranscriptionForm stepKey={tab.value} />
            </AnimatedTabContent>
          ))}

          <AnimatedTabContent value={DASHBOARD_TABS.RESULTS}>
            <TranscriptionResults transcript={transcript} />
          </AnimatedTabContent>
        </AnimatePresence>
      </Tabs>
    </Card>
  )
}

export default function Dashboard({
  isLoading,
  setIsLoading,
}: {
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}) {
  return (
    <Fragment>
      <TranscriptionFormsProvider
        isLoading={isLoading}
        setIsLoading={setIsLoading}>
        <DashboardContent />
      </TranscriptionFormsProvider>
    </Fragment>
  )
}
