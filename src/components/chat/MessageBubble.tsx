'use client'

import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
          <div className='prose prose-sm max-w-none dark:prose-invert'>
            <Markdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => (
                  <p className='text-xs sm:text-sm leading-6 sm:leading-7 text-foreground mb-2 sm:mb-3 last:mb-0'>
                    {children}
                  </p>
                ),
                h1: ({ children }) => (
                  <h1 className='text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 mt-3 sm:mt-4 first:mt-0'>
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className='text-base sm:text-lg font-semibold text-foreground mb-2 mt-3 sm:mt-4 first:mt-0'>
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className='text-sm sm:text-base font-semibold text-foreground mb-2 mt-2 sm:mt-3 first:mt-0'>
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className='text-xs sm:text-sm font-semibold text-foreground mb-2 mt-2 sm:mt-3 first:mt-0'>
                    {children}
                  </h4>
                ),
                ul: ({ children }) => (
                  <ul className='list-disc list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3 text-xs sm:text-sm text-foreground'>
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className='list-decimal list-inside space-y-0.5 sm:space-y-1 mb-2 sm:mb-3 text-xs sm:text-sm text-foreground'>
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className='text-xs sm:text-sm text-foreground break-words'>
                    {children}
                  </li>
                ),
                code: ({ children }) => (
                  <code className='bg-muted px-1 sm:px-1.5 py-0.5 rounded text-xs font-mono text-foreground break-all'>
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className='bg-muted p-2 sm:p-3 rounded-lg overflow-x-auto text-xs font-mono mb-2 sm:mb-3'>
                    {children}
                  </pre>
                ),
                blockquote: ({ children }) => (
                  <blockquote className='border-l-4 border-primary/30 pl-3 sm:pl-4 italic text-muted-foreground mb-2 sm:mb-3 text-xs sm:text-sm'>
                    {children}
                  </blockquote>
                ),
                strong: ({ children }) => (
                  <strong className='font-semibold text-foreground'>
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className='italic text-foreground'>{children}</em>
                ),
              }}>
              {message.content}
            </Markdown>
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
