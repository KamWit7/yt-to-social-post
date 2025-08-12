'use client'

import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from '@/components/common/form'
import { FileText, Sparkles, Youtube } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { FORM_FIELD_NAMES } from '../constants/formConstants'

interface FormFieldsProps {
  isLoading: boolean
  isTranscriptLoading?: boolean
}

export function FormFields({
  isLoading,
  isTranscriptLoading,
}: FormFieldsProps) {
  const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })

  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )

  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data?.map((item) => ({
        label: item.label,
        value: item.code,
      }))
    : []

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
        disabled={isLoading || isTranscriptLoading}
        required
        rows={8}
        textareaClassName='max-h-[300px] overflow-y-auto pr-10'
        icon={
          isTranscriptLoading ? (
            <svg className='w-5 h-5 animate-spin' viewBox='0 0 24 24'>
              <circle
                className='opacity-25'
                cx='12'
                cy='12'
                r='10'
                stroke='currentColor'
                strokeWidth='4'
                fill='none'></circle>
              <path
                className='opacity-75'
                fill='currentColor'
                d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'></path>
            </svg>
          ) : (
            <FileText className='w-5 h-5' />
          )
        }
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
            disabled={isLoading || isTranscriptLoading || isPurposeLoading}
            required
            options={purposeOptions}
            className='sm:w-1/2'
          />
          {purpose === 'custom' && (
            <ControlledInput
              name={FORM_FIELD_NAMES.CUSTOM_PURPOSE}
              placeholder='Wpisz własny cel...'
              disabled={isLoading || isTranscriptLoading}
              className='sm:w-1/2'
            />
          )}
        </div>
      </div>

      {/* Opcje warunkowe */}
      {purpose === 'learning' && (
        <div className='space-y-3'>
          <ControlledCheckbox
            name={FORM_FIELD_NAMES.GENERATE_MIND_MAP}
            label='Wygeneruj mapę myśli'
            disabled={isLoading || isTranscriptLoading}
          />
        </div>
      )}

      {purpose === 'social_media' && (
        <div className='space-y-3'>
          <ControlledCheckbox
            name={FORM_FIELD_NAMES.GENERATE_SOCIAL_POST}
            label='Wygeneruj post na social media'
            disabled={isLoading || isTranscriptLoading}
          />
        </div>
      )}

      {purpose === 'custom' && (
        <div className='space-y-3'>
          <ControlledInput
            name={FORM_FIELD_NAMES.CUSTOM_PROMPT}
            label='Twoje polecenie'
            placeholder='Wpisz własne polecenie dla AI...'
            disabled={isLoading || isTranscriptLoading}
          />
        </div>
      )}
    </div>
  )
}
