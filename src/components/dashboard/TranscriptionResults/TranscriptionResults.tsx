'use client'

import { CopyButton } from '@/components/common'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AIProcessingResponse, ApiResponse } from '@/types'
import { FileText, Hash, MessageSquare } from 'lucide-react'
import { DASHBOARD_TABS } from '../Dashboard.helpers'
import { useTranscriptionForms } from '../TranscriptionForms/context'
import { MindMapCard } from './components'

export default function TranscriptionResults() {
  const { formStepsState } = useTranscriptionForms()
  const data = formStepsState[DASHBOARD_TABS.RESULTS] as
    | ApiResponse<AIProcessingResponse>
    | undefined

  const error =
    data && !data.success ? new Error(data.error || 'Unknown error') : null

  if (error) {
    return (
      <Card className='border-destructive'>
        <CardContent className='pt-6'>
          <div className='text-center text-destructive'>
            <p className='font-medium'>Wystąpił błąd podczas przetwarzania</p>
            <p className='text-sm mt-1'>{error?.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.success || !data.data) {
    return (
      <Card className='border-muted'>
        <CardContent className='pt-6'>
          <div className='text-center text-muted-foreground'>
            <p className='font-medium'>Brak wyników przetwarzania</p>
            <p className='text-sm mt-1'>
              Przetworz swój transkrypt w zakładce &quot;Cel&quot;, aby zobaczyć
              wyniki
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Streszczenie */}
      {data.data.summary && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='w-5 h-5' />
              Streszczenie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <p className='text-sm leading-7 flex-1'>{data.data.summary}</p>
              <CopyButton
                text={data.data.summary || ''}
                className='shrink-0'
                aria-label='Kopiuj streszczenie'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tematy */}
      {data.data.topics && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Hash className='w-5 h-5' />
              Kluczowe tematy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex-1 whitespace-pre-line text-sm leading-7'>
                {data.data.topics}
              </div>
              <CopyButton
                text={data.data.topics || ''}
                className='shrink-0'
                aria-label='Kopiuj tematy'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa myśli */}
      {data.data.mindMap && <MindMapCard mindMap={data.data.mindMap} />}

      {/* Post na social media */}
      {data.data.socialPost && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <MessageSquare className='w-5 h-5' />
              Post na social media
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex-1 whitespace-pre-line text-sm leading-7'>
                {data.data.socialPost}
              </div>
              <CopyButton
                text={data.data.socialPost || ''}
                className='shrink-0'
                aria-label='Kopiuj post na social media'
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Własne polecenie */}
      {data.data.customOutput && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='w-5 h-5' />
              Wynik własnego polecenia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <div className='flex-1 whitespace-pre-line text-sm leading-7'>
                {data.data.customOutput}
              </div>
              <CopyButton
                text={data.data.customOutput || ''}
                className='shrink-0'
                aria-label='Kopiuj wynik własnego polecenia'
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
