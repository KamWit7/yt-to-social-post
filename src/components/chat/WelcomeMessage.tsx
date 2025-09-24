'use client'

import { Bot } from 'lucide-react'

export function WelcomeMessage() {
  return (
    <div className='flex flex-col items-center justify-center h-full text-center space-y-3 sm:space-y-4 px-4'>
      <div className='relative'>
        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center'>
          <Bot className='w-6 h-6 sm:w-8 sm:h-8 text-primary' />
        </div>
        <div className='absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-full animate-ping' />
      </div>
      <div className='space-y-2'>
        <h3 className='text-base sm:text-lg font-semibold text-foreground'>
          Witaj w czacie z AI!
        </h3>
        <p className='text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-md leading-relaxed'>
          Zadaj mi pytanie, a postaram się udzielić szczegółowej i pomocnej
          odpowiedzi.
        </p>
      </div>
    </div>
  )
}
