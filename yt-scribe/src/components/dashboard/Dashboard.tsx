'use client'

import { useAIProcessing } from '@/api/hooks/useAIProcessing'
import { Card } from '@/components/ui/card'
import { Fragment, useState } from 'react'
import TranscriptionForm from './TranscriptionForm/TranscriptionForm'
import TranscriptionResults from './TranscriptionResults/TranscriptionResults'

export default function Dashboard() {
  const [currentTranscript, setCurrentTranscript] = useState('')

  const {
    data: aiResult,
    isPending: isAIProcessing,
    error: aiError,
  } = useAIProcessing()

  const handleTranscriptChange = (transcript: string) => {
    setCurrentTranscript(transcript)
  }

  return (
    <Fragment>
      <Card className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 mb-8'>
        <TranscriptionForm onTranscriptChange={handleTranscriptChange} />
      </Card>
      <TranscriptionResults
        data={aiResult}
        isLoading={isAIProcessing}
        error={aiError}
        transcript={currentTranscript}
        onTranscriptChange={handleTranscriptChange}
      />
    </Fragment>
  )
}
