'use client'

import { getTranscriptQueryKey } from '@/api/hooks/useTranscript'
import { queryClient } from '@/components/provider/QueryProvider'
import { TranscriptResponse } from '@/types'
import { copyToClipboard } from '@/utils/clipboard'
import { useIsFetching } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import {
  CopyType,
  SummaryCard,
  TopicsCard,
  TranscriptCard,
} from './components/index'

function TranscriptionResults() {
  const [copiedItem, setCopiedItem] = useState<CopyType | null>(null)

  const isLoading =
    useIsFetching({
      queryKey: getTranscriptQueryKey(),
    }) > 0

  const { summary, topics } = { summary: '', topics: [] }

  const { transcript } = useMemo(
    () =>
      queryClient.getQueryData<TranscriptResponse>(getTranscriptQueryKey()) || {
        transcript: '',
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading]
  )

  const handleCopy = async (text: string, type: CopyType) => {
    const result = await copyToClipboard(text)

    if (result.success) {
      setCopiedItem(type)
      setTimeout(() => setCopiedItem(null), 2000)
    } else {
      console.error('Copy failed:', result.error)
    }
  }

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
        onCopy={handleCopy}
        copiedItem={copiedItem}
      />
    </div>
  )
}

export default TranscriptionResults
