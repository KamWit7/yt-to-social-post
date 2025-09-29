import { Dictionary } from '@/app/api/dictionaries'
import { DEFAULT_AI_MODEL } from '@/types'
import { useState } from 'react'

export interface ApiResultFormData {
  transcript: string
  purpose: string
  language: 'pl' | 'en'
  customPrompt: string
  model: string
}

export interface UseApiResultReturn {
  formData: ApiResultFormData
  isLoading: boolean
  response: string
  error: string
  handleInputChange: (field: string, value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  resetForm: () => void
  setSampleTranscript: (type: 'short' | 'medium' | 'long') => void
}

const initialFormData: ApiResultFormData = {
  transcript: '',
  purpose: Dictionary.Purpose.SocialMedia,
  language: 'pl',
  customPrompt: '',
  model: DEFAULT_AI_MODEL,
}

const sampleTranscripts = {
  short:
    'Witam wszystkich! Dzisiaj opowiem wam o nowych technologiach w programowaniu. React 18 wprowadza wiele ciekawych funkcji, które mogą znacznie poprawić wydajność naszych aplikacji.',
  medium:
    'Dzień dobry! W dzisiejszym odcinku chciałbym porozmawiać o sztucznej inteligencji i jej wpływie na nasze codzienne życie. AI już teraz pomaga nam w wielu dziedzinach - od medycyny po rozrywkę. Ale czy powinniśmy się obawiać, że zastąpi nas w pracy? To bardzo ważne pytanie, które zadaje sobie wielu z nas. W mojej opinii, AI powinno być traktowane jako narzędzie, które może nas wspierać, a nie zastępować.',
  long: 'Witam serdecznie wszystkich widzów! Dzisiaj przygotowałem dla was bardzo ciekawy temat dotyczący przyszłości programowania i technologii. Chciałbym porozmawiać o tym, jak sztuczna inteligencja zmienia sposób, w jaki tworzymy oprogramowanie. W ostatnich latach obserwujemy prawdziwą rewolucję w tej dziedzinie. Narzędzia takie jak GitHub Copilot, ChatGPT czy inne asystenty AI pomagają programistom w codziennej pracy. Ale to dopiero początek. W przyszłości możemy spodziewać się jeszcze bardziej zaawansowanych rozwiązań, które będą mogły automatycznie generować całe aplikacje na podstawie opisu w języku naturalnym. To brzmi jak science fiction, ale już teraz widzimy pierwsze próby takich systemów. Oczywiście, pojawiają się też pytania o bezpieczeństwo, prywatność i etyczne aspekty używania AI w programowaniu. To bardzo ważne tematy, które wymagają głębokiej dyskusji i przemyślanych rozwiązań.',
}

export function useApiResult(): UseApiResultReturn {
  const [formData, setFormData] = useState<ApiResultFormData>(initialFormData)
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

  const setSampleTranscript = (type: 'short' | 'medium' | 'long') => {
    handleInputChange('transcript', sampleTranscripts[type])
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setResponse('')
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
            } catch (e) {
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

  return {
    formData,
    isLoading,
    response,
    error,
    handleInputChange,
    handleSubmit,
    resetForm,
    setSampleTranscript,
  }
}
