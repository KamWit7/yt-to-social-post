'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'
import { useRef } from 'react'

interface ChatInputProps {
  inputValue: string
  setInputValue: (value: string) => void
  isLoading: boolean
  onSendMessage: (message: string) => void
}

export function ChatInput({
  inputValue,
  setInputValue,
  isLoading,
  onSendMessage,
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSendMessage(inputValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSendMessage(inputValue)
    }
  }

  return (
    <Card className='mt-2 sm:mt-4 bg-card/80 backdrop-blur-sm shadow-lg border-border/50'>
      <CardContent className='p-3 sm:p-4'>
        <form onSubmit={handleSubmit} className='flex gap-2 sm:gap-3'>
          <div className='flex-1 relative'>
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Napisz wiadomość...'
              disabled={isLoading}
              className={cn(
                'pr-10 sm:pr-12 bg-background/50 border-border/50 transition-all duration-200',
                'focus:border-primary/50 focus:ring-primary/20 focus:shadow-md',
                'text-sm sm:text-base h-9 sm:h-10',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            />
            <Button
              type='submit'
              size='icon'
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'absolute right-0.5 sm:right-1 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-md',
                'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90',
                'shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
              )}>
              {isLoading ? (
                <div className='w-3 h-3 sm:w-4 sm:h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
              ) : (
                <Send className='w-3 h-3 sm:w-4 sm:h-4' />
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export type { ChatInputProps }
