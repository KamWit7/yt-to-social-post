'use client'

import { AnimatedSection } from '@/components/animation'
import { ControlledInput } from '@/components/common/form'
import { Sparkles } from 'lucide-react'
import { ANIMATION_DELAYS } from '../../components/Section.helpers'
import { FORM_FIELD_NAMES } from '../../TasncriptionForms.constants'

interface ConditionalOptionsProps {
  purpose?: string
}

export function ConditionalOptions({ purpose }: ConditionalOptionsProps) {
  return (
    <div>
      <AnimatedSection
        isVisible={purpose === 'social_media'}
        delay={ANIMATION_DELAYS.conditionalOptions}>
        <div className='space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
          <h3 className='text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-green-600' />
            Wygeneruj post na social media
          </h3>
        </div>
      </AnimatedSection>

      <AnimatedSection
        isVisible={purpose === 'custom'}
        delay={ANIMATION_DELAYS.conditionalOptions}>
        <div className='space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
          <h3 className='text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2'>
            <Sparkles className='w-5 h-5 text-purple-600' />
            Własne polecenie
          </h3>
          <ControlledInput
            name={FORM_FIELD_NAMES.CUSTOM_PROMPT}
            label='twoje polecenie'
            placeholder='Wpisz własne polecenie dla AI...'
          />
        </div>
      </AnimatedSection>
    </div>
  )
}
