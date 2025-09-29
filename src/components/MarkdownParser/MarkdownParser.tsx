'use client'

import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownParserProps {
  text: string
  className?: string
}

export const getMarkdownComponents = (): Components => {
  return {
    p: ({ children }) => (
      <p className='text-sm leading-7 text-foreground mb-3 last:mb-0'>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className='text-2xl font-bold text-foreground mb-4 mt-6 first:mt-0'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-xl font-semibold text-foreground mb-3 mt-5 first:mt-0'>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-lg font-semibold text-foreground mb-2 mt-4 first:mt-0'>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className='text-base font-semibold text-foreground mb-2 mt-3 first:mt-0'>
        {children}
      </h4>
    ),
    ul: ({ children }) => (
      <ul className='list-disc list-inside space-y-1 mb-3 text-sm text-foreground'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='list-decimal list-inside space-y-1 mb-3 text-sm text-foreground'>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className='text-sm text-foreground break-words'>{children}</li>
    ),
    code: ({ children }) => (
      <code className='bg-muted px-2 py-1 rounded text-sm font-mono text-foreground break-all'>
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className='bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono mb-3'>
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className='border-l-4 border-primary/30 pl-4 italic text-muted-foreground mb-3 text-sm'>
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className='font-semibold text-foreground'>{children}</strong>
    ),
    em: ({ children }) => (
      <em className='italic text-foreground'>{children}</em>
    ),
  }
}

export function MarkdownParser({ text, className }: MarkdownParserProps) {
  const components = useMemo(() => getMarkdownComponents(), [])

  return (
    <div
      className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </Markdown>
    </div>
  )
}

export type { MarkdownParserProps }
