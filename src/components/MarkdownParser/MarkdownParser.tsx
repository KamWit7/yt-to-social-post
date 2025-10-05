'use client'

import CopyButton from '@/components/common/CopyButton'
import { cn } from '@/lib/utils'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import { useEffect, useMemo } from 'react'
import Markdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'

Prism.hooks.add('before-highlight', function (env) {
  env.code = (env.element as HTMLElement).innerText
})

// Initialize Prism for client-side highlighting
if (typeof window !== 'undefined') {
  Prism.manual = true
}

interface MarkdownParserProps {
  text: string
  className?: string
}

const getMarkdownComponents = (): Components => {
  return {
    p: ({ children }) => (
      <p className='text-sm leading-relaxed text-foreground/90 mb-4 last:mb-0 transition-all duration-300 animate-in fade-in hover:text-foreground'>
        {children}
      </p>
    ),
    h1: ({ children }) => (
      <h1 className='text-3xl font-bold bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent mb-6 mt-8 first:mt-0 tracking-tight leading-tight drop-shadow-sm'>
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className='text-2xl font-semibold text-foreground mb-4 mt-7 first:mt-0 relative group'>
        <span className='absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-purple-500 to-purple-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></span>
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className='text-xl font-semibold text-foreground mb-3 mt-6 first:mt-0 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300'>
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className='text-lg font-semibold text-foreground mb-3 mt-5 first:mt-0 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300'>
        {children}
      </h4>
    ),
    ul: ({ children }) => (
      <ul className='list-none space-y-2 mb-4 text-sm text-foreground/90 pl-4'>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className='list-none space-y-2 mb-4 text-sm text-foreground/90 pl-4'>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className='text-sm text-foreground/90 break-words relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:bg-gradient-to-r before:from-purple-500 before:to-purple-300 before:rounded-full before:opacity-60 hover:text-foreground hover:before:opacity-100 transition-all duration-300'>
        {children}
      </li>
    ),
    code: ({ children, className }) => {
      const isInline = !className?.includes('language-')
      const language = className?.replace('language-', '') || 'text'
      const codeString = String(children)

      if (isInline) {
        return (
          <code className='bg-muted px-2 py-1 rounded text-sm font-mono text-foreground break-all'>
            {children}
          </code>
        )
      }

      return (
        <div className='relative mb-6 group'>
          <div className='rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300'>
            <div className='flex items-center justify-between px-4 py-3 bg-[#2d2d2d] border-b border-gray-600'>
              <span className='text-sm font-medium text-[#d4d4d4]'>
                {language.toUpperCase()}
              </span>
              <CopyButton
                text={codeString}
                className='bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'
                aria-label='Kopiuj kod'
              />
            </div>

            <div className='overflow-x-auto'>
              <pre className={`language-${language} !m-0 !p-4`}>
                <code className={`language-${language}`}>{codeString}</code>
              </pre>
            </div>
          </div>
        </div>
      )
    },
    pre: ({ children }) => {
      // Let the code component handle the pre wrapper
      return <>{children}</>
    },
    blockquote: ({ children }) => (
      <blockquote className='border-l-4 border-purple-500 pl-6 italic text-muted-foreground mb-4 text-sm bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/20 dark:to-transparent py-3 rounded-r-lg shadow-sm hover:shadow-md transition-all duration-300'>
        {children}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className='font-semibold text-foreground bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-1 py-0.5 rounded-sm transition-all duration-300 hover:shadow-sm'>
        {children}
      </strong>
    ),
    em: ({ children }) => (
      <em className='italic text-foreground/80 transition-colors duration-300'>
        {children}
      </em>
    ),
  }
}

export function MarkdownParser({ text, className }: MarkdownParserProps) {
  const components = useMemo(() => getMarkdownComponents(), [])

  // Highlight code blocks after render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Prism.highlightAll()
    }
  }, [text])

  return (
    <div
      className={cn('prose prose-sm max-w-none dark:prose-invert', className)}>
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {text}
      </Markdown>
    </div>
  )
}
