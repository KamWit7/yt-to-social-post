'use client'

import { Bot, FileText, List } from 'lucide-react'
import { useState } from 'react'
import CollapsibleCard from '../common/CollapsibleCard'
import CopyButton from '../common/CopyButton'
import CustomCard from '../common/CustomCard'
import SkeletonLoader from '../common/SkeletonLoader'

interface TranscriptionResultsProps {
  isLoading: boolean
  transcript: string
  summary: string
  topics: string[]
}

export default function TranscriptionResults({
  isLoading,
  transcript,
  summary,
  topics,
}: TranscriptionResultsProps) {
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedItem(type)
        setTimeout(() => setCopiedItem(null), 2000)
      })
      .catch(() => {
        console.error('Błąd podczas kopiowania')
      })
  }

  if (!isLoading && !transcript) {
    return null
  }

  return (
    <div className='space-y-8'>
      <div className='grid md:grid-cols-2 gap-8'>
        <CustomCard
          icon={<Bot className='w-6 h-6 text-purple-500' />}
          title='Streszczenie AI'
          copyAction={
            !isLoading &&
            summary && (
              <CopyButton
                onCopy={() => handleCopy(summary, 'summary')}
                isCopied={copiedItem === 'summary'}
              />
            )
          }>
          {isLoading && !summary ? <SkeletonLoader lines={5} /> : summary}
        </CustomCard>
        <CustomCard
          icon={<List className='w-6 h-6 text-green-500' />}
          title='Główne tematy'
          copyAction={
            !isLoading &&
            topics.length > 0 && (
              <CopyButton
                onCopy={() => handleCopy(topics.join('\n'), 'topics')}
                isCopied={copiedItem === 'topics'}
              />
            )
          }>
          {isLoading && topics.length === 0 ? (
            <SkeletonLoader lines={5} type='list' />
          ) : (
            <ul className='space-y-2'>
              {topics.map((topic, index) => (
                <li key={index} className='flex items-start'>
                  <span className='text-green-500 mr-2 mt-1'>✓</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          )}
        </CustomCard>
      </div>

      <CollapsibleCard
        icon={<FileText className='w-6 h-6 text-blue-500' />}
        title='Pełna transkrypcja'
        isVisible={isTranscriptVisible}
        onToggle={() => setIsTranscriptVisible(!isTranscriptVisible)}
        copyAction={
          !isLoading &&
          transcript && (
            <CopyButton
              onCopy={() => handleCopy(transcript, 'transcript')}
              isCopied={copiedItem === 'transcript'}
            />
          )
        }>
        {isLoading && !transcript ? (
          <SkeletonLoader lines={8} />
        ) : (
          <p>{transcript}</p>
        )}
      </CollapsibleCard>
    </div>
  )
}
