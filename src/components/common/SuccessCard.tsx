'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { AnimatedSection } from '../animation'

interface SuccessCardProps {
  title: string
  description: string
  buttonText?: string
  onButtonClick?: () => void
  additionalContent?: React.ReactNode
  isPinging?: boolean
}

export default function SuccessCard({
  title,
  description,
  buttonText,
  onButtonClick,
  additionalContent,
  isPinging,
}: SuccessCardProps) {
  return (
    <AnimatedSection isVisible>
      <Card className='w-full max-w-md mx-auto my-2'>
        <CardContent>
          <div className='text-center space-y-6'>
            <div className='relative'>
              <div className='w-12 h-12 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center mx-auto shadow-lg'>
                <CheckCircle2 className='w-6 h-6 text-green-600' />
              </div>
              {isPinging && (
                <div className='absolute inset-0 w-12 h-12 bg-green-200 rounded-full mx-auto animate-ping opacity-20 z-100' />
              )}
            </div>

            <div className='space-y-2'>
              <h3 className='text-xl font-bold text-green-800'>{title}</h3>
              <p className='text-sm text-muted-foreground'>{description}</p>
              {additionalContent && additionalContent}
            </div>

            {buttonText && onButtonClick && (
              <Button onClick={onButtonClick} className='w-full'>
                {buttonText}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </AnimatedSection>
  )
}
