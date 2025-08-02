'use client'

import { copyToClipboard } from '@/utils/clipboard'
import { useState } from 'react'
import {
  CopyType,
  SummaryCard,
  TopicsCard,
  TranscriptCard,
} from './components/index'

interface TranscriptionResultsProps {
  isLoading: boolean
  transcript: string
  summary: string
  topics: string[]
}

function TranscriptionResults({
  isLoading,
  transcript,
  summary,
  topics,
}: TranscriptionResultsProps) {
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false)
  const [copiedItem, setCopiedItem] = useState<CopyType | null>(null)

  const handleCopy = async (text: string, type: CopyType) => {
    const result = await copyToClipboard(text)

    if (result.success) {
      setCopiedItem(type)
      setTimeout(() => setCopiedItem(null), 2000)
    } else {
      console.error('Copy failed:', result.error)
    }
  }

  const handleToggleTranscript = () => {
    setIsTranscriptVisible((prev) => !prev)
  }

  // Early return if no data and not loading
  if (!isLoading && !transcript && !summary && !topics.length) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        <SummaryCard
          isLoading={isLoading}
          summary={summary}
          onCopy={handleCopy}
          copiedItem={copiedItem}
        />
        <TopicsCard
          isLoading={isLoading}
          topics={topics}
          onCopy={handleCopy}
          copiedItem={copiedItem}
        />
      </div>

      <TranscriptCard
        isLoading={isLoading}
        transcript={transcript}
        isVisible={isTranscriptVisible}
        onToggle={handleToggleTranscript}
        onCopy={handleCopy}
        copiedItem={copiedItem}
      />
    </div>
  )
}

export default TranscriptionResults
