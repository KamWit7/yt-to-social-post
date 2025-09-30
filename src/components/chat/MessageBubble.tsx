'use client'

import { MarkdownParser } from '@/components/MarkdownParser'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

export function MessageBubble({
  message,
  isStreaming = false,
}: MessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-2 sm:gap-3 animate-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}>
      {!isUser && (
        <div className='flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary/20 to-purple-500/20 rounded-full flex items-center justify-center shadow-sm'>
          <Bot className='w-3 h-3 sm:w-4 sm:h-4 text-primary' />
        </div>
      )}

      <div
        className={cn(
          'max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 shadow-sm hover:shadow-md',
          isUser
            ? 'bg-gradient-to-r from-primary to-purple-600 text-primary-foreground ml-6 sm:ml-12'
            : 'bg-muted/50 border border-border/50 mr-6 sm:mr-12'
        )}>
        {isUser ? (
          <p className='text-xs sm:text-sm leading-relaxed break-words'>
            {message.content}
          </p>
        ) : (
          <div>
            <MarkdownParser text={message.content} />
            {isStreaming && (
              <div className='inline-flex items-center gap-1 mt-1 sm:mt-2'>
                <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse' />
                <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse delay-75' />
                <div className='w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-pulse delay-150' />
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className='flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center shadow-sm'>
          <User className='w-3 h-3 sm:w-4 sm:h-4 text-primary-foreground' />
        </div>
      )}
    </div>
  )
}

export type { Message, MessageBubbleProps }
