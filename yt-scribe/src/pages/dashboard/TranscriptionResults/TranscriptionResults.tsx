'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AIProcessingResponse } from '@/types'
import {
  Brain,
  Copy,
  Edit,
  FileText,
  Hash,
  MessageSquare,
  Save,
} from 'lucide-react'
import { useState } from 'react'

interface TranscriptionResultsProps {
  data?: AIProcessingResponse
  isLoading: boolean
  error?: Error | null
  transcript?: string
  onTranscriptChange?: (transcript: string) => void
}

export default function TranscriptionResults({
  data,
  isLoading,
  error,
  transcript,
  onTranscriptChange,
}: TranscriptionResultsProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [isEditingTranscript, setIsEditingTranscript] = useState(false)
  const [editedTranscript, setEditedTranscript] = useState(transcript || '')

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(fieldName)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  if (isLoading) {
    return (
      <div className='space-y-6'>
        <div className='animate-pulse'>
          <div className='h-4 bg-muted rounded w-1/4 mb-4'></div>
          <div className='h-32 bg-muted rounded-lg'></div>
        </div>
        <div className='animate-pulse'>
          <div className='h-4 bg-muted rounded w-1/4 mb-4'></div>
          <div className='h-24 bg-muted rounded-lg'></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className='border-destructive'>
        <CardContent className='pt-6'>
          <div className='text-center text-destructive'>
            <p className='font-medium'>Wystąpił błąd podczas przetwarzania</p>
            <p className='text-sm mt-1'>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data || !data.success) {
    return null
  }

  const handleSaveTranscript = () => {
    if (onTranscriptChange) {
      onTranscriptChange(editedTranscript)
    }
    setIsEditingTranscript(false)
  }

  const handleCancelEdit = () => {
    setEditedTranscript(transcript || '')
    setIsEditingTranscript(false)
  }

  return (
    <div className='space-y-6'>
      {/* Transkrypcja */}
      {transcript && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <FileText className='w-5 h-5' />
                Transkrypcja
              </div>
              <div className='flex gap-2'>
                {!isEditingTranscript ? (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setIsEditingTranscript(true)}>
                    <Edit className='w-4 h-4 mr-2' />
                    Edytuj
                  </Button>
                ) : (
                  <>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleSaveTranscript}>
                      <Save className='w-4 h-4 mr-2' />
                      Zapisz
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleCancelEdit}>
                      Anuluj
                    </Button>
                  </>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingTranscript ? (
              <Textarea
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                rows={8}
                className='w-full'
              />
            ) : (
              <div className='whitespace-pre-line text-sm leading-7 max-h-64 overflow-y-auto'>
                {transcript}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Streszczenie */}
      {data.summary && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <FileText className='w-5 h-5' />
              Streszczenie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <p className='text-sm leading-7 flex-1'>{data.summary}</p>
              <Button
                variant='outline'
                size='sm'
                onClick={() => copyToClipboard(data.summary!, 'summary')}
                className='shrink-0'>
                <Copy className='w-4 h-4 mr-2' />
                {copiedField === 'summary' ? 'Skopiowano!' : 'Kopiuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tematy */}
      {data.topics && (
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
                {data.topics}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => copyToClipboard(data.topics!, 'topics')}
                className='shrink-0'>
                <Copy className='w-4 h-4 mr-2' />
                {copiedField === 'topics' ? 'Skopiowano!' : 'Kopiuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapa myśli */}
      {data.mindMap && (
        <Card className='border border-border/60 shadow-sm hover:shadow-md transition-shadow'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Brain className='w-5 h-5' />
              Mapa myśli
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex justify-between items-start gap-4'>
              <pre className='flex-1 text-xs bg-muted p-3 rounded-lg overflow-auto max-h-64'>
                {JSON.stringify(data.mindMap, null, 2)}
              </pre>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  copyToClipboard(
                    JSON.stringify(data.mindMap, null, 2),
                    'mindMap'
                  )
                }
                className='shrink-0'>
                <Copy className='w-4 h-4 mr-2' />
                {copiedField === 'mindMap' ? 'Skopiowano!' : 'Kopiuj JSON'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Post na social media */}
      {data.socialPost && (
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
                {data.socialPost}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() => copyToClipboard(data.socialPost!, 'socialPost')}
                className='shrink-0'>
                <Copy className='w-4 h-4 mr-2' />
                {copiedField === 'socialPost' ? 'Skopiowano!' : 'Kopiuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Własne polecenie */}
      {data.customOutput && (
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
                {data.customOutput}
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={() =>
                  copyToClipboard(data.customOutput!, 'customOutput')
                }
                className='shrink-0'>
                <Copy className='w-4 h-4 mr-2' />
                {copiedField === 'customOutput' ? 'Skopiowano!' : 'Kopiuj'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
