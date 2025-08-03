'use client'

import { useCachedGet } from '@/api/hooks/useCachedGet'
import { getTranscriptQueryKey } from '@/api/hooks/useTranscript'
import { TranscriptResponse } from '@/types'
import { SummaryCard, TopicsCard, TranscriptCard } from './components/index'

function TranscriptionResults() {
  const {
    cache: { data },
    isLoading,
  } = useCachedGet<TranscriptResponse>(getTranscriptQueryKey())

  const { transcript } = data ?? {}

  const { summary, topics } = { summary: ' ', topics: [] }

  if (!transcript) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        <SummaryCard isLoading={isLoading} summary={summary} />
        <TopicsCard isLoading={isLoading} topics={topics} />
      </div>

      <TranscriptCard isLoading={isLoading} transcript={transcript ?? ''} />
    </div>
  )
}

export default TranscriptionResults
