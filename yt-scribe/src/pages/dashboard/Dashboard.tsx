'use client'
import { getAIProcessingQueryKey } from '@/api/hooks/useAIProcessing'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCachedMutation } from '@/hooks/useCachedMutation'
import { AIProcessingResponse, ApiResponse } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Brain, FileText, Sparkles, Youtube } from 'lucide-react'
import { Fragment, useEffect, useState } from 'react'
import TranscriptionForm from './TranscriptionForm/TranscriptionForm'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'

export default function Dashboard() {
  const [currentTranscript, setCurrentTranscript] = useState('')
  const [activeTab, setActiveTab] = useState('youtube')

  // Track completion of each step
  const [stepCompleted, setStepCompleted] = useState({
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
    setActiveTab('results')
    // Mark purpose step as completed
    setStepCompleted((prev) => ({ ...prev, purpose: true }))
  }

  const handleStepComplete = (step: keyof typeof stepCompleted) => {
    setStepCompleted((prev) => ({ ...prev, [step]: true }))
  }

  return (
    <Fragment>
      <Card className='bg-white/60 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 shadow-md border border-gray-200/60 dark:border-gray-800/60 mb-8'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-4 mb-8'>
            <TabsTrigger
              value='youtube'
              className='flex items-center gap-2'
              disabled={isAIProcessingLoading}>
              <Youtube className='w-4 h-4' />
              <span className='hidden sm:inline'>YouTube Link</span>
              {stepCompleted.youtube && (
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='transcript'
              className='flex items-center gap-2'
              disabled={!stepCompleted.youtube || isAIProcessingLoading}>
              <FileText className='w-4 h-4' />
              <span className='hidden sm:inline'>Transkrypcja</span>
              {stepCompleted.transcript && (
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='purpose'
              className='flex items-center gap-2'
              disabled={!stepCompleted.transcript || isAIProcessingLoading}>
              <Sparkles className='w-4 h-4' />
              <span className='hidden sm:inline'>Cel</span>
              {stepCompleted.purpose && (
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value='results'
              className='flex items-center gap-2'
              disabled={!stepCompleted.purpose}>
              <Brain className='w-4 h-4' />
              <span className='hidden sm:inline'>Wyniki</span>
              {stepCompleted.results && (
                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
              )}
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode='wait'>
            <TabsContent key='youtube' value='youtube' className='mt-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <TranscriptionForm
                  onTranscriptChange={handleTranscriptChange}
                  onTabChange={setActiveTab}
                  onAIProcessingStart={handleAIProcessingStart}
                  onStepComplete={handleStepComplete}
                  externalTranscript={currentTranscript}
                />
              </motion.div>
            </TabsContent>

            <TabsContent key='transcript' value='transcript' className='mt-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <TranscriptionForm
                  onTranscriptChange={handleTranscriptChange}
                  onTabChange={setActiveTab}
                  onAIProcessingStart={handleAIProcessingStart}
                  showTranscriptTab={true}
                  onStepComplete={handleStepComplete}
                  externalTranscript={currentTranscript}
                />
              </motion.div>
            </TabsContent>

            <TabsContent key='purpose' value='purpose' className='mt-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                <TranscriptionForm
                  onTranscriptChange={handleTranscriptChange}
                  onTabChange={setActiveTab}
                  onAIProcessingStart={handleAIProcessingStart}
                  showPurposeTab={true}
                  onStepComplete={handleStepComplete}
                  externalTranscript={currentTranscript}
                />
              </motion.div>
            </TabsContent>

            <TabsContent key='results' value='results' className='mt-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}>
                {isAIProcessingLoading ? (
                  <div className='flex flex-col items-center justify-center py-12 space-y-4'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
                    <p className='text-lg font-medium text-gray-600 dark:text-gray-400'>
                      Przetwarzam transkrypcję z AI...
                    </p>
                    <p className='text-sm text-gray-500 dark:text-gray-500'>
                      To może potrwać kilka minut
                    </p>
                  </div>
                ) : (
                  <TranscriptionResults
                    transcript={currentTranscript}
                    onTranscriptChange={handleTranscriptChange}
                  />
                )}
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </Card>
    </Fragment>
  )
}
