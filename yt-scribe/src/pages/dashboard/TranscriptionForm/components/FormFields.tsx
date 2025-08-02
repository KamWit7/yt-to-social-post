'use client'

import { ControlledInput, ControlledSelect } from '@/components/common/form'
import { Sparkles, Youtube } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { FORM_FIELD_NAMES, PURPOSE_OPTIONS } from '../constants/formConstants'

interface FormFieldsProps {
  isLoading: boolean
}

export function FormFields({ isLoading }: FormFieldsProps) {
  const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })

  return (
    <div className='space-y-4'>
      <ControlledInput
        name={FORM_FIELD_NAMES.URL}
        label='Link YouTube'
        placeholder='https://www.youtube.com/watch?v=...'
        disabled={isLoading}
        required
        icon={<Youtube className='w-5 h-5' />}
        type='url'
        autoComplete='url'
      />

      <div className='space-y-3'>
        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          <Sparkles className='w-5 h-5 text-purple-500' />
          <span>W jakim celu generujesz transkrypcję?</span>
        </label>
        <div className='flex flex-col sm:flex-row items-center gap-3'>
          <ControlledSelect
            name={FORM_FIELD_NAMES.PURPOSE}
            placeholder='Wybierz cel...'
            disabled={isLoading}
            required
            options={PURPOSE_OPTIONS}
            className='sm:w-1/2'
          />
          {purpose === 'Inny' && (
            <ControlledInput
              name={FORM_FIELD_NAMES.CUSTOM_PURPOSE}
              placeholder='Wpisz własny cel...'
              disabled={isLoading}
              className='sm:w-1/2'
            />
          )}
        </div>
      </div>
    </div>
  )
}
