'use client'

import {
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from '@/components/common/form'
import { FileText, Sparkles, Youtube } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { FORM_FIELD_NAMES, PURPOSE_OPTIONS } from '../constants/formConstants'

interface FormFieldsProps {
  isLoading: boolean
  isTranscriptLoading?: boolean
  onFetchTranscript?: () => void
}

export function FormFields({
  isLoading,
  isTranscriptLoading,
  onFetchTranscript,
}: FormFieldsProps) {
  const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })
  const url = useWatch({ name: FORM_FIELD_NAMES.URL })

  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <ControlledInput
          name={FORM_FIELD_NAMES.URL}
          label='Link YouTube (opcjonalnie)'
          placeholder='https://www.youtube.com/watch?v=...'
          disabled={isLoading || isTranscriptLoading}
          icon={<Youtube className='w-5 h-5' />}
          type='url'
          autoComplete='url'
        />
      </div>

      <ControlledTextarea
        name={FORM_FIELD_NAMES.TRANSCRIPT}
        label='Transkrypcja'
        placeholder='Wklej tutaj transkrypcję z filmu YouTube lub pobierz ją z linku powyżej...'
        disabled={isLoading}
        required
        rows={8}
        textareaClassName='max-h-[300px] overflow-y-auto'
        icon={<FileText className='w-5 h-5' />}
      />

      <div className='space-y-3'>
        <label className='flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300'>
          <Sparkles className='w-5 h-5 text-purple-500' />
          <span>W jakim celu przetwarzasz transkrypcję?</span>
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

      {/* Opcje warunkowe */}
      {purpose === 'Do nauki' && (
        <div className='space-y-3'>
          <ControlledCheckbox
            name={FORM_FIELD_NAMES.GENERATE_MIND_MAP}
            label='Wygeneruj mapę myśli'
            disabled={isLoading}
          />
        </div>
      )}

      {purpose === 'Do tworzenia treści' && (
        <div className='space-y-3'>
          <ControlledCheckbox
            name={FORM_FIELD_NAMES.GENERATE_SOCIAL_POST}
            label='Wygeneruj post na social media'
            disabled={isLoading}
          />
        </div>
      )}

      {purpose === 'Ogólne' && (
        <div className='space-y-3'>
          <ControlledInput
            name={FORM_FIELD_NAMES.CUSTOM_PROMPT}
            label='Twoje polecenie'
            placeholder='Wpisz własne polecenie dla AI...'
            disabled={isLoading}
          />
        </div>
      )}
    </div>
  )
}
