'use client'

import { useDictionary } from '@/api/hooks/useDictionary'
import { DictionaryCode } from '@/api/services/dictionaryService'
import AILoadingAnimation from '@/components/animation/AILoadingAnimation'
import AnimatedSection from '@/components/animation/AnimatedSection'
import {
  ControlledCheckbox,
  ControlledInput,
  ControlledSelect,
  ControlledTextarea,
} from '@/components/common/form'
import { Button } from '@/components/ui/button'
import SectionHeader from '@/components/ui/SectionHeader'
import { motion } from 'framer-motion'
import { FileText, Sparkles, Wand2, Youtube } from 'lucide-react'
import { useEffect } from 'react'
import { useWatch } from 'react-hook-form'
import { FORM_FIELD_NAMES, LOADING_MESSAGES } from '../constants/formConstants'

interface FormFieldsProps {
  isLoading: boolean
  isTranscriptLoading?: boolean
  onFetchTranscript?: () => void
  canFetchTranscript?: boolean
  hasTranscript: boolean
  showAISection: boolean
  showTranscriptTab?: boolean
  showPurposeTab?: boolean
  onTabChange?: (tab: string) => void
  onSubmit?: (e?: React.BaseSyntheticEvent) => Promise<void>
  transcriptError?: Error | null
  onStepComplete?: (
    step: 'youtube' | 'transcript' | 'purpose' | 'results'
  ) => void
}

export function FormFields({
  isLoading,
  isTranscriptLoading,
  onFetchTranscript,
  canFetchTranscript,
  hasTranscript,
  showAISection,
  showTranscriptTab = false,
  showPurposeTab = false,
  onTabChange,
  onSubmit,
  transcriptError,
  onStepComplete,
}: FormFieldsProps) {
  const { data: purposeDict, isLoading: isPurposeLoading } = useDictionary(
    DictionaryCode.Purpose
  )

  const purposeOptions = Array.isArray(purposeDict?.data)
    ? purposeDict.data?.map((item) => ({
        label: item.label,
        value: item.code,
      }))
    : []

  // Watch form values for conditional rendering
  const purpose = useWatch({ name: FORM_FIELD_NAMES.PURPOSE })
  const transcript = useWatch({ name: FORM_FIELD_NAMES.TRANSCRIPT })

  // Auto-load transcript into TextArea when transcript tab is shown
  useEffect(() => {
    if (showTranscriptTab && !transcript && onStepComplete) {
      // If we're in transcript tab but no transcript in form,
      // check if we have transcript from parent component
      // This will be handled by the parent component's transcript state
    }
  }, [showTranscriptTab, transcript, onStepComplete])

  // Show AI loading animation when processing
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}>
        <AILoadingAnimation
          message='Przetwarzam transkrypcję z AI...'
          className='my-8'
        />
      </motion.div>
    )
  }

  // Determine which sections to show based on props
  const showYouTubeSection = !showTranscriptTab && !showPurposeTab
  const showTranscriptSection = showTranscriptTab && !showPurposeTab
  const showPurposeSection =
    showPurposeTab || (hasTranscript && !showTranscriptTab)

  return (
    <div className='space-y-12'>
      {/* Section 1: URL Input and Generate Button */}
      {showYouTubeSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
          className='space-y-8'>
          <SectionHeader
            icon={<Youtube className='w-6 h-6 text-white' />}
            title='Podaj Link z YouTube'
            subtitle='Wklej link do filmu YouTube lub zostaw puste, aby wkleić transkrypcję ręcznie'
            iconBgColor='bg-gradient-to-r from-red-500 to-red-600'
          />

          <div className='space-y-6'>
            <ControlledInput
              name={FORM_FIELD_NAMES.URL}
              placeholder='https://www.youtube.com/watch?v=...'
              disabled={isLoading || isTranscriptLoading}
              icon={<Youtube className='w-5 h-5' />}
              type='url'
              autoComplete='url'
            />

            {onFetchTranscript && (
              <div className='space-y-4'>
                <Button
                  type='button'
                  onClick={() => {
                    onFetchTranscript()
                    // Don't change tab immediately - wait for successful response
                  }}
                  disabled={
                    !canFetchTranscript || isTranscriptLoading || isLoading
                  }
                  className='w-full flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-500 disabled:to-gray-600 text-base'>
                  {isTranscriptLoading ? (
                    <>
                      <svg
                        className='w-5 h-5 animate-spin mr-3'
                        viewBox='0 0 24 24'>
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
                      <span>{LOADING_MESSAGES.FETCHING_TRANSCRIPT}</span>
                    </>
                  ) : (
                    <>
                      <Wand2 className='w-5 h-5 mr-3' />
                      <span>Wygeneruj Transkrypcję</span>
                    </>
                  )}
                </Button>

                {/* Error message and retry button */}
                {transcriptError && (
                  <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                    <div className='flex items-center gap-2 mb-3'>
                      <svg
                        className='w-5 h-5 text-red-500'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                        />
                      </svg>
                      <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                        Nie udało się pobrać transkrypcji
                      </p>
                    </div>
                    <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
                      {transcriptError.message ||
                        'Wystąpił błąd podczas pobierania transkrypcji z YouTube.'}
                    </p>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={onFetchTranscript}
                      disabled={isTranscriptLoading}
                      className='text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30'>
                      {isTranscriptLoading ? 'Pobieram...' : 'Spróbuj ponownie'}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Section 2: Transcript and Purpose Selection - appears after transcript is available */}
      {showTranscriptSection && (
        <AnimatedSection
          isVisible={hasTranscript || showTranscriptTab}
          delay={0.2}
          className='space-y-8'>
          <SectionHeader
            icon={<FileText className='w-6 h-6 text-white' />}
            title='Przygotuj Transkrypcję'
            subtitle='Edytuj transkrypcję i wybierz cel jej przetwarzania'
            iconBgColor='bg-gradient-to-r from-blue-500 to-blue-600'
          />

          <div className='space-y-8'>
            <div className='space-y-4'>
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
            </div>

            {/* Show error if transcript fetch failed */}
            {transcriptError && (
              <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                <div className='flex items-center gap-2 mb-3'>
                  <svg
                    className='w-5 h-5 text-red-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                    Błąd podczas pobierania transkrypcji
                  </p>
                </div>
                <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
                  {transcriptError.message ||
                    'Wystąpił błąd podczas pobierania transkrypcji z YouTube.'}
                </p>
                <div className='flex gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={onFetchTranscript}
                    disabled={isTranscriptLoading}
                    className='text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30'>
                    {isTranscriptLoading ? 'Pobieram...' : 'Spróbuj ponownie'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onTabChange?.('youtube')}
                    className='text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-900/30'>
                    Wróć do linku
                  </Button>
                </div>
              </div>
            )}
          </div>

          {showTranscriptTab && (
            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={() => {
                  onStepComplete?.('transcript')
                  onTabChange?.('purpose')
                }}
                disabled={!hasTranscript}
                className='px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
                Następny krok
              </Button>
            </div>
          )}
        </AnimatedSection>
      )}

      {/* Section 3: Purpose Selection */}
      {showPurposeSection && (hasTranscript || showPurposeTab) && (
        <AnimatedSection
          isVisible={hasTranscript || showPurposeTab}
          delay={0.2}
          className='space-y-8'>
          <div>
            <SectionHeader
              icon={<Sparkles className='w-6 h-6 text-white' />}
              title='W jakim celu przetwarzasz transkrypcję?'
              subtitle='Wybierz cel przetwarzania i dostosuj opcje do swoich potrzeb'
              iconBgColor='bg-gradient-to-r from-purple-500 to-purple-600'
              className={showPurposeTab ? '' : 'mt-12'}
            />

            <div className='space-y-8'>
              <ControlledSelect
                name={FORM_FIELD_NAMES.PURPOSE}
                placeholder='Wybierz cel...'
                disabled={isLoading || isTranscriptLoading || isPurposeLoading}
                required
                options={purposeOptions}
                className='sm:w-1/2'
              />
            </div>

            {/* Show error if transcript fetch failed */}
            {transcriptError && (
              <div className='p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800'>
                <div className='flex items-center gap-2 mb-3'>
                  <svg
                    className='w-5 h-5 text-red-500'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                    />
                  </svg>
                  <p className='text-sm font-medium text-red-800 dark:text-red-200'>
                    Błąd podczas pobierania transkrypcji
                  </p>
                </div>
                <p className='text-sm text-red-700 dark:text-red-300 mb-3'>
                  {transcriptError.message ||
                    'Wystąpił błąd podczas pobierania transkrypcji z YouTube.'}
                </p>
                <div className='flex gap-3'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={onFetchTranscript}
                    disabled={isTranscriptLoading}
                    className='text-red-700 border-red-300 hover:bg-red-100 dark:text-red-300 dark:border-red-600 dark:hover:bg-red-900/30'>
                    {isTranscriptLoading ? 'Pobieram...' : 'Spróbuj ponownie'}
                  </Button>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onTabChange?.('youtube')}
                    className='text-gray-700 border-gray-300 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-900/30'>
                    Wróć do linku
                  </Button>
                </div>
              </div>
            )}

            {/* Conditional Options */}
            {purpose === 'learning' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className='space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800'>
                <h3 className='text-lg font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2'>
                  <Sparkles className='w-5 h-5 text-blue-600' />
                  Opcje dla nauki
                </h3>
                <ControlledCheckbox
                  name={FORM_FIELD_NAMES.GENERATE_MIND_MAP}
                  label='Wygeneruj mapę myśli'
                  disabled={isLoading || isTranscriptLoading}
                />
              </motion.div>
            )}

            {purpose === 'social_media' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className='space-y-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
                <h3 className='text-lg font-semibold text-green-800 dark:text-green-200 flex items-center gap-2'>
                  <Sparkles className='w-5 h-5 text-green-600' />
                  Opcje dla social media
                </h3>
                <ControlledCheckbox
                  name={FORM_FIELD_NAMES.GENERATE_SOCIAL_POST}
                  label='Wygeneruj post na social media'
                  disabled={isLoading || isTranscriptLoading}
                />
              </motion.div>
            )}

            {purpose === 'custom' && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className='space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800'>
                <h3 className='text-lg font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2'>
                  <Sparkles className='w-5 h-5 text-purple-600' />
                  Własne polecenie
                </h3>
                <ControlledInput
                  name={FORM_FIELD_NAMES.CUSTOM_PROMPT}
                  label='Twoje polecenie'
                  placeholder='Wpisz własne polecenie dla AI...'
                  disabled={isLoading || isTranscriptLoading}
                />
              </motion.div>
            )}
          </div>

          {showPurposeTab && (
            <div className='flex justify-end'>
              <Button
                type='button'
                onClick={() => {
                  onStepComplete?.('purpose')
                  onTabChange?.('results')
                  onSubmit?.()
                }}
                disabled={isLoading}
                className='px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'>
                {isLoading ? (
                  <>
                    <svg
                      className='w-4 h-4 animate-spin mr-2'
                      viewBox='0 0 24 24'>
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
                    Przetwarzam...
                  </>
                ) : (
                  'Przetwórz z AI'
                )}
              </Button>
            </div>
          )}
        </AnimatedSection>
      )}
    </div>
  )
}
