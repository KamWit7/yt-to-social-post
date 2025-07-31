'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Bot,
  Check,
  ChevronDown,
  Copy,
  FileText,
  List,
  Loader2,
  LogIn,
  Search,
  Sparkles,
  Youtube,
} from 'lucide-react'
import { useState } from 'react'

// Mock function to simulate API calls
const fakeApiCall = (duration = 2000) =>
  new Promise((resolve) => setTimeout(resolve, duration))

// Copy Button Component
const CopyButton = ({
  onCopy,
  isCopied,
}: {
  onCopy: () => void
  isCopied: boolean
}) => (
  <Button
    onClick={onCopy}
    variant='ghost'
    size='sm'
    className={`flex items-center gap-1.5 px-2 py-1 text-xs transition-colors ${
      isCopied
        ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
        : 'bg-gray-100 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}>
    {isCopied ? (
      <Check className='w-3.5 h-3.5' />
    ) : (
      <Copy className='w-3.5 h-3.5' />
    )}
    <span>{isCopied ? 'Skopiowano' : 'Kopiuj'}</span>
  </Button>
)

// Custom Card Component
const CustomCard = ({
  icon,
  title,
  children,
  copyAction,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  copyAction?: React.ReactNode
}) => (
  <Card className='bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50'>
    <CardHeader className='p-4 border-b border-gray-200/80 dark:border-gray-700/80 flex justify-between items-center'>
      <div className='flex items-center space-x-3'>
        {icon}
        <CardTitle className='font-semibold text-gray-800 dark:text-white'>
          {title}
        </CardTitle>
      </div>
      {copyAction}
    </CardHeader>
    <CardContent className='p-6 text-gray-700 dark:text-gray-300 text-sm leading-relaxed'>
      {children}
    </CardContent>
  </Card>
)

// Collapsible Card Component
const CollapsibleCard = ({
  icon,
  title,
  children,
  isVisible,
  onToggle,
  copyAction,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  isVisible: boolean
  onToggle: () => void
  copyAction?: React.ReactNode
}) => (
  <Card className='bg-white/60 dark:bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden'>
    <CardHeader className='p-4 flex justify-between items-center'>
      <div className='flex items-center space-x-3'>
        {icon}
        <CardTitle className='font-semibold text-gray-800 dark:text-white'>
          {title}
        </CardTitle>
      </div>
      <div className='flex items-center gap-2'>
        {copyAction}
        <Button
          onClick={onToggle}
          variant='ghost'
          size='sm'
          className='p-1 rounded-full hover:bg-gray-50/50 dark:hover:bg-gray-700/30'>
          <ChevronDown
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transform transition-transform duration-300 ${
              isVisible ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </div>
    </CardHeader>
    <div
      className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${
        isVisible ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}>
      <div className='overflow-hidden'>
        <CardContent className='p-6 pt-2 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-200/80 dark:border-gray-700/80'>
          {children}
        </CardContent>
      </div>
    </div>
  </Card>
)

// Skeleton Loader Component
const SkeletonLoader = ({
  lines = 3,
  type = 'text',
}: {
  lines?: number
  type?: 'text' | 'list'
}) => {
  return (
    <div className='space-y-3 animate-pulse'>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className='flex items-center space-x-2'>
          {type === 'list' && <Skeleton className='h-4 w-4 rounded-full' />}
          <Skeleton
            className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`}
          />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [summary, setSummary] = useState('')
  const [topics, setTopics] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isTranscriptVisible, setIsTranscriptVisible] = useState(false)
  const [purpose, setPurpose] = useState('Do nauki')
  const [customPurpose, setCustomPurpose] = useState('')
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

  const handleFetchTranscript = async () => {
    if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
      setError('Wprowadź poprawny link do filmu na YouTube.')
      return
    }
    setError('')
    setIsLoading(true)
    setTranscript('')
    setSummary('')
    setTopics([])
    setIsTranscriptVisible(false)

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

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 font-sans'>
      {/* Header */}
      <header className='sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-lg shadow-sm'>
        <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-6 w-6 text-gray-700 dark:text-gray-300'>
                <path d='M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z' />
                <path d='M10 2c1 .5 2 2 2 5' />
              </svg>
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                Transkrypcje AI
              </span>
            </div>
            <Button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              variant='ghost'
              className='flex items-center space-x-2 px-3 py-1.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/70 text-sm font-semibold transition-colors'>
              <LogIn className='w-4 h-4' />
              <span>{isLoggedIn ? 'Moje konto' : 'Zaloguj się'}</span>
            </Button>
          </div>
        </nav>
      </header>

      <main className='p-4 md:p-8'>
        <div className='max-w-4xl mx-auto'>
          {/* Input Section */}
          <div className='text-center my-12 md:my-16'>
            <h1 className='text-4xl md:text-6xl font-bold mb-4 text-gray-800 dark:text-white'>
              Analiza wideo z AI.
            </h1>
            <p className='max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-400'>
              Wklej link do filmu z YouTube, aby uzyskać automatyczną
              transkrypcję, streszczenie i listę poruszanych tematów.
            </p>
          </div>

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
                onClick={handleFetchTranscript}
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

          {/* Results Section */}
          {(isLoading || transcript) && (
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
                  {isLoading && !summary ? (
                    <SkeletonLoader lines={5} />
                  ) : (
                    summary
                  )}
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
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className='bg-gray-100 dark:bg-gray-900/80 mt-16 border-t border-gray-200 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex items-center space-x-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='h-6 w-6 text-gray-700 dark:text-gray-300'>
                <path d='M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z' />
                <path d='M10 2c1 .5 2 2 2 5' />
              </svg>
              <span className='text-lg font-semibold text-gray-800 dark:text-white'>
                Transkrypcje AI
              </span>
            </div>
          </div>
          <div className='mt-8 border-t border-gray-200 dark:border-gray-800 pt-8 text-sm text-gray-500 dark:text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-2'>
            <p>
              &copy; {new Date().getFullYear()} Transkrypcje AI. Wszelkie prawa
              zastrzeżone.
            </p>
            <p>Stworzone z ❤️ w Polsce.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
