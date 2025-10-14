'use client'

import { useTranscriptionForms } from '@/components/dashboard/TranscriptionForms/TranscriptionFormsContext'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/utils/constants'
import { ArrowRight, Lock } from 'lucide-react'
import Link from 'next/link'
import { useState, type ReactNode } from 'react'

interface PremiumFeatureTooltipProps {
  children: ReactNode
  isByokUser: boolean
  title: string
  description: string
}

export function PremiumFeatureTooltip({
  children,
  isByokUser,
  title,
  description,
}: PremiumFeatureTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { handleSaveState } = useTranscriptionForms()

  if (isByokUser) {
    return children
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className='relative group'>
          {/* Premium visual hint on hover */}
          <div
            className={cn(
              'relative rounded-lg overflow-hidden transition-all duration-300 ',
              isOpen && 'ring-2 ring-slate-400/30'
            )}>
            <div className='pointer-events-none'>{children}</div>

            {/* Premium badge */}
            <div className='absolute top-2 right-2 pointer-events-none'>
              <div
                className={`bg-slate-700/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-lg transition-opacity duration-300 ${
                  isOpen ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className='flex items-center gap-1'>
                  <Lock className='w-3 h-3 text-slate-200' />
                  <span className='text-[10px] font-semibold text-slate-200 uppercase tracking-wider'>
                    BYOK
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent
        side='bottom'
        className='max-w-xs p-4 border border-primary/20 bg-white/20 backdrop-blur-md'>
        <div className='space-y-2'>
          <p className='font-medium text-foreground'>{title}</p>

          <Link href={ROUTES.SETTINGS} onClick={handleSaveState}>
            <p className='text-sm text-muted-foreground leading-relaxed flex items-center gap-2 group hover:text-primary'>
              Dodaj swój klucz API w ustawieniach
              <ArrowRight className='w-[17px] h-6 transition-transform duration-200 group-hover:translate-x-1' />
            </p>
          </Link>

          <span className='text-xs text-muted-foreground'>
            🔒 {description}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  )
}
