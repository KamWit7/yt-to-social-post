'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, Copy, ExternalLink } from 'lucide-react'
import { useState } from 'react'

/**
 * Component providing detailed instructions for obtaining a Google Gemini API key
 * Includes step-by-step guide and helpful links
 */
export function ApiKeyInstructions({ className }: { className?: string }) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null)

  /**
   * Copies text to clipboard and shows feedback
   */
  const copyToClipboard = async (text: string, stepNumber: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStep(stepNumber)
      setTimeout(() => setCopiedStep(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Jak uzyskać klucz API Google Gemini</CardTitle>
        <CardDescription>
          Wykonaj te kroki, aby uzyskać klucz API Google Gemini do
          nieograniczonego przetwarzania
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Quick Links */}
        <div className='flex flex-wrap gap-2'>
          <Button variant='outline' size='sm' asChild>
            <a
              href='https://aistudio.google.com/app/apikey'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2'>
              <ExternalLink className='h-3 w-3' />
              Google AI Studio
            </a>
          </Button>
          <Button variant='outline' size='sm' asChild>
            <a
              href='https://console.cloud.google.com/'
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2'>
              <ExternalLink className='h-3 w-3' />
              Google Cloud Console
            </a>
          </Button>
        </div>

        {/* Step-by-step Instructions */}
        <div className='space-y-4'>
          <h4 className='font-medium'>Przewodnik krok po kroku:</h4>

          <div className='space-y-4'>
            {/* Step 1 */}
            <InstructionStep
              number={1}
              title='Odwiedź Google AI Studio'
              description='Przejdź do Google AI Studio, aby utworzyć swój klucz API'
              action={
                <Button variant='outline' size='sm' asChild>
                  <a
                    href='https://aistudio.google.com/app/apikey'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Otwórz AI Studio
                  </a>
                </Button>
              }
            />

            {/* Step 2 */}
            <InstructionStep
              number={2}
              title='Zaloguj się kontem Google'
              description='Użyj swojego konta Google, aby uzyskać dostęp do AI Studio. Jeśli go nie masz, najpierw utwórz bezpłatne konto Google.'
            />

            {/* Step 3 */}
            <InstructionStep
              number={3}
              title='Utwórz klucz API'
              description='Kliknij przycisk "Utwórz klucz API" i wybierz swój projekt Google Cloud (lub utwórz nowy, jeśli potrzeba).'
            />

            {/* Step 4 */}
            <InstructionStep
              number={4}
              title='Skopiuj swój klucz API'
              description='Po utworzeniu skopiuj klucz API. Powinien zaczynać się od "AIza" i mieć 39 znaków.'
              copyText='AIzaSyC...'
              onCopy={() => copyToClipboard('AIzaSyC...', 4)}
              copied={copiedStep === 4}
            />

            {/* Step 5 */}
            <InstructionStep
              number={5}
              title='Wklej w ustawieniach'
              description='Wróć na tę stronę i wklej swój klucz API w formularzu powyżej, aby przejść na poziom BYOK.'
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface InstructionStepProps {
  number: number
  title: string
  description: string
  action?: React.ReactNode
  copyText?: string
  onCopy?: () => void
  copied?: boolean
}

/**
 * Individual instruction step component
 */
function InstructionStep({
  number,
  title,
  description,
  action,
  copyText,
  onCopy,
  copied,
}: InstructionStepProps) {
  return (
    <div className='flex gap-4 p-4 border rounded-lg'>
      <div className='flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium'>
        {number}
      </div>
      <div className='flex-1 space-y-2'>
        <h5 className='font-medium'>{title}</h5>
        <p className='text-sm text-muted-foreground'>{description}</p>
        <div className='flex items-center gap-2'>
          {action}
          {copyText && onCopy && (
            <Button
              variant='outline'
              size='sm'
              onClick={onCopy}
              className='flex items-center gap-2'>
              {copied ? (
                <CheckCircle className='h-3 w-3 text-green-500' />
              ) : (
                <Copy className='h-3 w-3' />
              )}
              {copied ? 'Skopiowano!' : 'Skopiuj przykład'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
