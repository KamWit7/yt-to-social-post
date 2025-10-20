'use client'

import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import { Brain, FileText, Sparkles, Youtube } from 'lucide-react'
import { useMemo } from 'react'
import { TranscriptionForm } from '.'
import { TextShimmer } from '../animation'
import { DashboardTabTrigger } from './components'
import { DASHBOARD_TABS } from './Dashboard.helpers'
import { useTranscriptionForms } from './TranscriptionForms/TranscriptionFormsContext'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'

function DashboardContent() {
  const { activeTab, stepCompleted, isLoading, handleTabChange } =
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

        {tabConfigs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <TranscriptionForm stepKey={tab.value} />
          </TabsContent>
        ))}

        <TabsContent value={DASHBOARD_TABS.RESULTS}>
          <TranscriptionResults />
        </TabsContent>
      </Tabs>
    </Card>
  )
}

export default function Dashboard() {
  const { isLoading, activeTab } = useTranscriptionForms()

  const isResultsTab = activeTab === DASHBOARD_TABS.RESULTS

  return (
    <motion.div
      className='mx-auto'
      initial={{
        maxWidth: '56rem', // equivalent to max-w-4xl (896px)
      }}
      animate={{
        maxWidth: isResultsTab ? '100%' : '56rem',
        width: isResultsTab ? '100%' : 'auto',
      }}
      transition={{
        duration: 0.3,
        ease: 'easeInOut',
      }}>
      <div className='text-center my-10 md:my-12'>
        <TextShimmer
          className='text-4xl md:text-6xl font-bold mb-4 text-gray-800 '
          isLoading={isLoading}>
          Analiza wideo z AI.
        </TextShimmer>
        <p className='max-w-2xl mx-auto text-lg md:text-xl text-gray-600'>
          wklej link do filmu z YouTube, aby uzyskać automatyczną transkrypcję,
          streszczenie i listę poruszanych tematów.
        </p>
      </div>

      <DashboardContent />
    </motion.div>
  )
}
