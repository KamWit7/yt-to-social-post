'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Search, Sparkles, Youtube } from 'lucide-react'
import { useState } from 'react'
import TranscriptionResults from './TranscriptionResults'

// Mock function to simulate API calls
const fakeApiCall = (duration = 2000) =>
  new Promise((resolve) => setTimeout(resolve, duration))

export default function TranscriptionForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleGenerate = async (url: string, purpose: string) => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Wprowadź poprawny link do filmu na YouTube.')
      return
    }
    setError('')
    setIsLoading(true)
    setTranscript('')
    setSummary('')
    setTopics([])

    try {
      // Simulate fetching transcript
      await fakeApiCall(1500)
      const mockTranscript = `To jest przykładowa transkrypcja filmu na YouTube. Omawiamy w nim wiele interesujących tematów, od programowania w React, przez projektowanie interfejsów, aż po najnowsze trendy w technologii. Użytkownicy mogą dowiedzieć się, jak efektywnie korzystać z hooków w React oraz jak zarządzać stanem w dużych aplikacjach. Poruszamy również kwestie związane z AI i machine learningiem. To tylko fragment, aby pokazać, jak działa zwijanie i rozwijanie treści. Pełna transkrypcja mogłaby być znacznie dłuższa, zawierając szczegółowe dialogi i opisy z całego materiału wideo.`
      setTranscript(mockTranscript)

      // Simulate AI analysis
      await fakeApiCall(1500)
      const mockSummary = `Film omawia kluczowe aspekty programowania w React, w tym wykorzystanie hooków i zarządzanie stanem. Porusza także tematykę projektowania interfejsów oraz wprowadza w świat sztucznej inteligencji i uczenia maszynowego, oferując praktyczne wskazówki dla deweloperów.`
      const mockTopics = [
        'Programowanie w React',
        'Projektowanie UI/UX',
        'Zarządzanie stanem',
        'Sztuczna Inteligencja (AI)',
        'Trendy technologiczne',
      ]
      setSummary(mockSummary)
      setTopics(mockTopics)
    } catch {
      setError('Nie udało się pobrać transkrypcji. Spróbuj ponownie.')
    } finally {
      setIsLoading(false)
    }
  }

  const [url, setUrl] = useState('')
  const [purpose, setPurpose] = useState('Do nauki')
  const [customPurpose, setCustomPurpose] = useState('')

  const handleSubmit = async () => {
    const finalPurpose = purpose === 'Inny' ? customPurpose : purpose
    await handleGenerate(url, finalPurpose)
  }

  return (
    <>
      <Card className='bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-800/50 mb-8'>
        <div className='space-y-4'>
          <div className='relative w-full'>
            <Youtube className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400' />
            <Input
              type='text'
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder='https://www.youtube.com/watch?v=...'
              disabled={isLoading}
              className='w-full pl-12 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
            />
          </div>

          <div className='space-y-3'>
            <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
              <Sparkles className='w-5 h-5 text-purple-500' />
              <span>W jakim celu generujesz transkrypcję?</span>
            </label>
            <div className='flex flex-col sm:flex-row items-center gap-3'>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                disabled={isLoading}
                className='w-full sm:w-1/2 pl-4 pr-10 py-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed appearance-none'>
                <option>Do nauki</option>
                <option>Do pracy</option>
                <option>Do tworzenia treści</option>
                <option>Ogólne</option>
                <option value='Inny'>Inny...</option>
              </select>
              {purpose === 'Inny' && (
                <Input
                  type='text'
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder='Wpisz własny cel...'
                  disabled={isLoading}
                  className='w-full sm:w-1/2 pl-4 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border-2 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                />
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !url}
            className='w-full flex-shrink-0 flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500'>
            {isLoading ? (
              <>
                <Loader2 className='animate-spin mr-2' />
                <span>Analizuję...</span>
              </>
            ) : (
              <>
                <Search className='mr-2 h-5 w-5' />
                <span>Generuj</span>
              </>
            )}
          </Button>
        </div>
        {error && <p className='text-red-500 mt-4 text-center'>{error}</p>}
      </Card>

      <TranscriptionResults
        isLoading={isLoading}
        transcript={transcript}
        summary={summary}
        topics={topics}
      />
    </>
  )
}
