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
export function ApiKeyInstructions() {
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
    <Card>
      <CardHeader>
        <CardTitle>How to Get Your Google Gemini API Key</CardTitle>
        <CardDescription>
          Follow these steps to obtain your Google Gemini API key for unlimited
          processing
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
          <h4 className='font-medium'>Step-by-step guide:</h4>

          <div className='space-y-4'>
            {/* Step 1 */}
            <InstructionStep
              number={1}
              title='Visit Google AI Studio'
              description='Go to Google AI Studio to create your API key'
              action={
                <Button variant='outline' size='sm' asChild>
                  <a
                    href='https://aistudio.google.com/app/apikey'
                    target='_blank'
                    rel='noopener noreferrer'>
                    Open AI Studio
                  </a>
                </Button>
              }
            />

            {/* Step 2 */}
            <InstructionStep
              number={2}
              title='Sign in with Google Account'
              description="Use your Google account to access AI Studio. If you don't have one, create a free Google account first."
            />

            {/* Step 3 */}
            <InstructionStep
              number={3}
              title='Create API Key'
              description="Click 'Create API Key' button and select your Google Cloud project (or create a new one if needed)."
            />

            {/* Step 4 */}
            <InstructionStep
              number={4}
              title='Copy Your API Key'
              description="Once created, copy the API key. It should start with 'AIza' and be 39 characters long."
              copyText='AIzaSyC...'
              onCopy={() => copyToClipboard('AIzaSyC...', 4)}
              copied={copiedStep === 4}
            />

            {/* Step 5 */}
            <InstructionStep
              number={5}
              title='Paste in Settings'
              description='Return to this page and paste your API key in the form above to upgrade to BYOK tier.'
            />
          </div>
        </div>

        {/* Important Notes */}
        <div className='p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
          <h4 className='font-medium text-yellow-800 dark:text-yellow-200 mb-2'>
            Important Notes:
          </h4>
          <ul className='text-sm text-yellow-700 dark:text-yellow-300 space-y-1'>
            <li>• Keep your API key secure and never share it publicly</li>
            <li>
              • Google Gemini API has its own pricing - check Google's pricing
              page
            </li>
            <li>• You can monitor your usage in Google Cloud Console</li>
            <li>
              • The API key will be encrypted and stored securely in our
              database
            </li>
            <li>• You can update or remove your API key anytime in settings</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className='space-y-3'>
          <h4 className='font-medium'>Troubleshooting:</h4>
          <div className='space-y-2 text-sm'>
            <TroubleshootingItem
              issue="Can't find 'Create API Key' button?"
              solution="Make sure you're signed in and have accepted Google's terms of service."
            />
            <TroubleshootingItem
              issue='API key validation fails?'
              solution="Ensure the key starts with 'AIza' and is exactly 39 characters long."
            />
            <TroubleshootingItem
              issue='Getting quota exceeded errors?'
              solution='Check your Google Cloud billing and API quotas in the Cloud Console.'
            />
          </div>
        </div>

        {/* Additional Resources */}
        <div className='pt-4 border-t'>
          <h4 className='font-medium mb-3'>Additional Resources:</h4>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
            <Button variant='ghost' size='sm' asChild className='justify-start'>
              <a
                href='https://ai.google.dev/pricing'
                target='_blank'
                rel='noopener noreferrer'>
                <ExternalLink className='h-3 w-3' />
                Gemini API Pricing
              </a>
            </Button>
            <Button variant='ghost' size='sm' asChild className='justify-start'>
              <a
                href='https://ai.google.dev/docs'
                target='_blank'
                rel='noopener noreferrer'>
                <ExternalLink className='h-3 w-3' />
                API Documentation
              </a>
            </Button>
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
              {copied ? 'Copied!' : 'Copy Example'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

interface TroubleshootingItemProps {
  issue: string
  solution: string
}

/**
 * Troubleshooting item component
 */
function TroubleshootingItem({ issue, solution }: TroubleshootingItemProps) {
  return (
    <div className='p-3 bg-muted/50 rounded-lg'>
      <p className='font-medium text-sm'>{issue}</p>
      <p className='text-sm text-muted-foreground mt-1'>{solution}</p>
    </div>
  )
}
