import { ExternalLink } from 'lucide-react'
import { Button } from '../ui/button'

export function AdditionalInfo() {
  return (
    <>
      {/* Important Notes */}
      <div className='p-4 dark:bg-yellow-950/20 border dark:border-yellow-800 rounded-lg'>
        <h4 className='font-medium mb-2'>Ważne uwagi:</h4>
        <ul className='text-sm space-y-1'>
          <li>
            • zachowaj bezpieczeństwo klucza API i nigdy nie udostępniaj go
            publicznie
          </li>
          <li>
            • google Gemini API ma własne ceny - sprawdź stronę cenową Google
          </li>
          <li>• możesz monitorować swoje użycie w Google Cloud Console</li>
          <li>
            • klucz API zostanie zaszyfrowany i bezpiecznie przechowany w naszej
            bazie danych
          </li>
          <li>
            • możesz zaktualizować lub usunąć swój klucz API w dowolnym momencie
            w ustawieniach
          </li>
        </ul>
      </div>

      {/* Additional Resources */}
      <div className='pt-4 border-t'>
        <h4 className='font-medium mb-3'>Dodatkowe zasoby:</h4>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
          <Button variant='ghost' size='sm' asChild className='justify-start'>
            <a
              href='https://ai.google.dev/pricing'
              target='_blank'
              rel='noopener noreferrer'>
              <ExternalLink className='h-3 w-3' />
              cennik API Gemini
            </a>
          </Button>
          <Button variant='ghost' size='sm' asChild className='justify-start'>
            <a
              href='https://ai.google.dev/docs'
              target='_blank'
              rel='noopener noreferrer'>
              <ExternalLink className='h-3 w-3' />
              dokumentacja API
            </a>
          </Button>
        </div>
      </div>
    </>
  )
}
