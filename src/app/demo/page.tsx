'use client'

import {
  Dictionary,
  DictionaryDisplay,
  PurposeValue,
} from '@/app/api/dictionaries'
import { AIModels, DEFAULT_AI_MODEL } from '@/types'
import { useState } from 'react'

export default function DemoPage() {
  const [formData, setFormData] = useState({
    transcript: '',
    purpose: Dictionary.Purpose.SocialMedia as PurposeValue,
    language: 'pl' as 'pl' | 'en',
    customPrompt: '',
    model: DEFAULT_AI_MODEL,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [error, setError] = useState('')

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResponse('')
    setError('')

    try {
      const response = await fetch('/api/result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let result = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              setIsLoading(false)
              return
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.text) {
                result += parsed.text
                setResponse(result)
              }
            } catch {
              // Ignore parsing errors for malformed JSON
            }
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const sampleTranscripts = {
    short:
      'Witam wszystkich! Dzisiaj opowiem wam o nowych technologiach w programowaniu. React 18 wprowadza wiele ciekawych funkcji, które mogą znacznie poprawić wydajność naszych aplikacji.',
    medium:
      'Dzień dobry! W dzisiejszym odcinku chciałbym porozmawiać o sztucznej inteligencji i jej wpływie na nasze codzienne życie. AI już teraz pomaga nam w wielu dziedzinach - od medycyny po rozrywkę. Ale czy powinniśmy się obawiać, że zastąpi nas w pracy? To bardzo ważne pytanie, które zadaje sobie wielu z nas. W mojej opinii, AI powinno być traktowane jako narzędzie, które może nas wspierać, a nie zastępować.',
    long: 'Witam serdecznie wszystkich widzów! Dzisiaj przygotowałem dla was bardzo ciekawy temat dotyczący przyszłości programowania i technologii. Chciałbym porozmawiać o tym, jak sztuczna inteligencja zmienia sposób, w jaki tworzymy oprogramowanie. W ostatnich latach obserwujemy prawdziwą rewolucję w tej dziedzinie. Narzędzia takie jak GitHub Copilot, ChatGPT czy inne asystenty AI pomagają programistom w codziennej pracy. Ale to dopiero początek. W przyszłości możemy spodziewać się jeszcze bardziej zaawansowanych rozwiązań, które będą mogły automatycznie generować całe aplikacje na podstawie opisu w języku naturalnym. To brzmi jak science fiction, ale już teraz widzimy pierwsze próby takich systemów. Oczywiście, pojawiają się też pytania o bezpieczeństwo, prywatność i etyczne aspekty używania AI w programowaniu. To bardzo ważne tematy, które wymagają głębokiej dyskusji i przemyślanych rozwiązań.',
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-8 text-center'>
            API Result Endpoint Demo
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* Transcript Input */}
            <div>
              <label
                htmlFor='transcript'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Transcript *
              </label>
              <textarea
                id='transcript'
                value={formData.transcript}
                onChange={(e) =>
                  handleInputChange('transcript', e.target.value)
                }
                rows={6}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Enter your transcript here...'
                required
              />
              <div className='mt-2 flex gap-2'>
                <button
                  type='button'
                  onClick={() =>
                    handleInputChange('transcript', sampleTranscripts.short)
                  }
                  className='text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded'>
                  Short Sample
                </button>
                <button
                  type='button'
                  onClick={() =>
                    handleInputChange('transcript', sampleTranscripts.medium)
                  }
                  className='text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded'>
                  Medium Sample
                </button>
                <button
                  type='button'
                  onClick={() =>
                    handleInputChange('transcript', sampleTranscripts.long)
                  }
                  className='text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded'>
                  Long Sample
                </button>
              </div>
            </div>

            {/* Purpose Selection */}
            <div>
              <label
                htmlFor='purpose'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Purpose *
              </label>
              <select
                id='purpose'
                value={formData.purpose}
                onChange={(e) => handleInputChange('purpose', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                required>
                {DictionaryDisplay.Purpose.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Prompt (only show when Custom purpose is selected) */}
            {formData.purpose === 'custom' && (
              <div>
                <label
                  htmlFor='customPrompt'
                  className='block text-sm font-medium text-gray-700 mb-2'>
                  Custom Prompt *
                </label>
                <textarea
                  id='customPrompt'
                  value={formData.customPrompt}
                  onChange={(e) =>
                    handleInputChange('customPrompt', e.target.value)
                  }
                  rows={3}
                  className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Enter your custom prompt...'
                  required={formData.purpose === 'custom'}
                />
              </div>
            )}

            {/* Language Selection */}
            <div>
              <label
                htmlFor='language'
                className='block text-sm font-medium text-gray-700 mb-2'>
                Language
              </label>
              <select
                id='language'
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                {DictionaryDisplay.Language.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Selection */}
            <div>
              <label
                htmlFor='model'
                className='block text-sm font-medium text-gray-700 mb-2'>
                AI Model
              </label>
              <select
                id='model'
                value={formData.model}
                onChange={(e) => handleInputChange('model', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'>
                {Object.entries(AIModels).map(([key, value]) => (
                  <option key={value} value={value}>
                    {key} ({value})
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type='submit'
              disabled={isLoading || !formData.transcript.trim()}
              className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed'>
              {isLoading ? 'Processing...' : 'Process Transcript'}
            </button>
          </form>

          {/* Error Display */}
          {error && (
            <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-md'>
              <h3 className='text-sm font-medium text-red-800'>Error:</h3>
              <p className='mt-1 text-sm text-red-700'>{error}</p>
            </div>
          )}

          {/* Response Display */}
          {response && (
            <div className='mt-6'>
              <h3 className='text-lg font-medium text-gray-900 mb-3'>
                AI Response:
              </h3>
              <div className='bg-gray-50 border border-gray-200 rounded-md p-4'>
                <pre className='whitespace-pre-wrap text-sm text-gray-800'>
                  {response}
                </pre>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className='mt-6 flex items-center justify-center'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
              <span className='ml-2 text-gray-600'>
                Processing your request...
              </span>
            </div>
          )}
        </div>

        {/* API Information */}
        <div className='mt-8 bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>
            API Information
          </h2>
          <div className='space-y-3 text-sm text-gray-600'>
            <div>
              <strong>Endpoint:</strong>{' '}
              <code className='bg-gray-100 px-2 py-1 rounded'>
                POST /api/result
              </code>
            </div>
            <div>
              <strong>Content-Type:</strong>{' '}
              <code className='bg-gray-100 px-2 py-1 rounded'>
                application/json
              </code>
            </div>
            <div>
              <strong>Response Format:</strong>{' '}
              <code className='bg-gray-100 px-2 py-1 rounded'>
                text/event-stream
              </code>
            </div>
            <div>
              <strong>Required Fields:</strong> transcript, purpose
            </div>
            <div>
              <strong>Optional Fields:</strong> language (default:
              &apos;pl&apos;), customPrompt, model (default:
              &apos;gemini-2.5-flash&apos;)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
