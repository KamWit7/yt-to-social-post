'use client'

import { AnimatedSection } from '@/components/animation'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface YouTubeErrorDisplayProps {
  error: Error | null
  onRetry: () => void
  isRetrying: boolean
  errorMessage: string
}

export function YouTubeErrorDisplay({
  error,
  onRetry,
  isRetrying,
  errorMessage,
}: YouTubeErrorDisplayProps) {
  const message = error?.message || errorMessage

  // Check for specific YouTube error types
  const isYouTubePageError = message.includes('Failed to fetch YouTube page')
  const isInvalidUrlError = message.includes('Invalid YouTube URL')
  const isTranscriptExtractionError = message.includes(
    'Failed to extract transcript parameters from HTML'
  )
  const isApiTranscriptError = message.includes(
    'Failed to fetch transcript from YouTube API'
  )
  const isFormatError = message.includes('Failed to format transcript')
  const isUnexpectedError = message.includes('Unexpected error:')

  const getErrorTitle = () => {
    if (isInvalidUrlError) {
      return 'Nieprawidłowy link YouTube'
    }
    if (isYouTubePageError) {
      return 'Nie można pobrać strony YouTube'
    }
    if (isTranscriptExtractionError) {
      return 'Nie można wyodrębnić transkrypcji'
    }
    if (isApiTranscriptError) {
      return 'Błąd API YouTube'
    }
    if (isFormatError) {
      return 'Błąd formatowania transkrypcji'
    }
    if (isUnexpectedError) {
      return 'Nieoczekiwany błąd'
    }
    return 'Nie udało się pobrać transkrypcji'
  }

  const getErrorMessage = () => {
    if (isInvalidUrlError) {
      return 'Podany link nie jest prawidłowym adresem YouTube. Sprawdź format linku.'
    }
    if (isYouTubePageError) {
      return 'Link może być nieprawidłowy, film może być prywatny lub niedostępny w Twojej lokalizacji.'
    }
    if (isTranscriptExtractionError) {
      return 'Film może nie mieć dostępnej transkrypcji lub może być w nieobsługiwanym formacie.'
    }
    if (isApiTranscriptError) {
      return 'Nie udało się pobrać transkrypcji z serwera YouTube. Może to być problem tymczasowy.'
    }
    if (isFormatError) {
      return 'Transkrypcja została pobrana, ale wystąpił błąd podczas jej przetwarzania.'
    }
    if (isUnexpectedError) {
      return 'Wystąpił nieoczekiwany błąd systemu. Spróbuj ponownie za chwilę.'
    }
    return message || 'Wystąpił błąd podczas pobierania transkrypcji z YouTube.'
  }

  const getSuggestions = () => {
    if (isInvalidUrlError) {
      return [
        'Upewnij się, że link zaczyna się od https://www.youtube.com/',
        'Sprawdź, czy link zawiera parametr watch?v=',
        'Skopiuj link bezpośrednio z paska adresu YouTube',
        'Przykład prawidłowego linku: https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      ]
    }
    if (isYouTubePageError) {
      return [
        'Link jest prawidłowy i prowadzi do filmu YouTube',
        'Film nie jest prywatny lub usunięty',
        'Film jest dostępny w Twojej lokalizacji',
        'Link zawiera pełny adres (np. https://www.youtube.com/watch?v=...)',
      ]
    }
    if (isTranscriptExtractionError) {
      return [
        'Film ma włączone napisy lub transkrypcję',
        'Film nie jest transmisją na żywo',
        'Spróbuj z innym filmem YouTube',
        'Sprawdź, czy film ma dostępne napisy w ustawieniach',
      ]
    }
    if (isApiTranscriptError) {
      return [
        'Sprawdź połączenie internetowe',
        'Spróbuj ponownie za kilka minut',
        'Upewnij się, że film ma dostępne napisy',
        'Sprawdź, czy YouTube nie ma problemów technicznych',
      ]
    }
    if (isFormatError) {
      return [
        'Spróbuj ponownie - może to być problem tymczasowy',
        'Sprawdź, czy film ma standardowy format transkrypcji',
        'Spróbuj z innym filmem YouTube',
      ]
    }
    if (isUnexpectedError) {
      return [
        'Odczekaj chwilę i spróbuj ponownie',
        'Sprawdź połączenie internetowe',
        'Jeśli problem się powtarza, skontaktuj się z pomocą techniczną',
      ]
    }
    return []
  }

  const suggestions = getSuggestions()

  return (
    <AnimatedSection isVisible={true} delay={0.1}>
      <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
        <div className='flex items-start gap-3 mb-3'>
          <AlertCircle className='w-5 h-5 text-red-500 mt-0.5 flex-shrink-0' />
          <div className='flex-1'>
            <p className='text-sm font-medium text-red-800 dark:text-red-200 mb-2'>
              {getErrorTitle()}
            </p>
            <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
              {getErrorMessage()}
            </p>

            {suggestions.length > 0 && (
              <div className='mb-4'>
                <p className='text-xs font-medium text-red-800 dark:text-red-200 mb-2'>
                  Sprawdź czy:
                </p>
                <ul className='text-xs text-red-700 dark:text-red-300 space-y-1 ml-4'>
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>• {suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={onRetry}
          disabled={isRetrying}
          className='text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30'>
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`}
          />
          {isRetrying ? 'Pobieram...' : 'Spróbuj ponownie'}
        </Button>
      </div>
    </AnimatedSection>
  )
}
