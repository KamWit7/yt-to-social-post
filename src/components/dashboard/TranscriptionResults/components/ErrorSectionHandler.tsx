'use client'

import { Card, CardContent } from '@/components/ui/card'
import { ReactNode } from 'react'

interface ErrorSectionHandlerProps {
  children: ReactNode
  sectionName: string
  aiError?: string
  isLoading?: boolean
}

export function ErrorSectionHandler({
  children,
  sectionName,
  aiError,
  isLoading,
}: ErrorSectionHandlerProps) {
  // If there's an error for this section, show error card
  if (aiError && !isLoading) {
    return (
      <Card className='border-destructive'>
        <CardContent className='pt-6'>
          <div className='text-center text-destructive'>
            <p className='font-medium'>
              Błąd podczas przetwarzania {sectionName.toLowerCase()}
            </p>
            <p className='text-sm mt-1'>{aiError}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // If there's no error, render the children
  return <>{children}</>
}
