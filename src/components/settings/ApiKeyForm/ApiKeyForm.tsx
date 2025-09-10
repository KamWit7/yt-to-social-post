'use client'

import { ControlledInput, SubmitButton } from '@/components/common'
import SectionHeader from '@/components/ui/SectionHeader'
import { saveApiKeyAndUpgradeTier } from '@/lib/actions/usage'
import { zodResolver } from '@hookform/resolvers/zod'
import { AccountTier } from '@prisma/client'
import { Eye, EyeOff, Key } from 'lucide-react'
import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  API_KEY_FORM_FIELD_NAMES,
  API_KEY_LOADING_MESSAGES,
  API_KEY_SUCCESS_MESSAGES,
  getApiKeyDefaultValues,
} from './ApiKeyForm.helpers'
import { apiKeySchema, type ApiKeyFormData } from './apiKeySchema'

interface ApiKeyFormProps {
  /** Current user's account tier */
  currentTier: AccountTier
  /** Whether user already has an API key stored */
  hasApiKey: boolean
}

/**
 * Form component for entering and managing Google Gemini API key
 * Handles validation, submission, and tier upgrade
 */
export function ApiKeyForm({ currentTier, hasApiKey }: ApiKeyFormProps) {
  const [showApiKey, setShowApiKey] = useState(false)

  const methods = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    mode: 'onChange',
    defaultValues: getApiKeyDefaultValues(),
  })

  const {
    handleSubmit,
    setError,
    clearErrors,
    formState: { isSubmitSuccessful, isSubmitting, errors, isValid },
  } = methods

  const onSubmitForm = async (data: ApiKeyFormData) => {
    clearErrors()

    try {
      const result = await saveApiKeyAndUpgradeTier(
        data[API_KEY_FORM_FIELD_NAMES.API_KEY]
      )

      if (!result.success) {
        setError('root.serverError', {
          type: 'server',
          message: result.error,
        })
      }
    } catch (err) {
      // Set form-level error using react-hook-form's error system
      setError('root.serverError', {
        type: 'server',
        message:
          err instanceof Error
            ? err.message
            : 'Failed to save API key. Please try again.',
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmitForm)}>
        <div className='space-y-12'>
          <SectionHeader
            icon={<Key className='w-6 h-6 text-white' />}
            title='Google Gemini API Key'
            subtitle={
              currentTier === AccountTier.BYOK && hasApiKey
                ? 'Update your API key to continue using unlimited processing'
                : 'Enter your API key to upgrade to BYOK tier and get unlimited processing'
            }
            iconBgColor='bg-gradient-to-r from-green-500 to-green-600'
          />

          {/* Current Status */}
          {currentTier === AccountTier.BYOK && hasApiKey && (
            <div className='p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
              <div className='flex items-center gap-2'>
                <Key className='h-4 w-4 text-green-600 dark:text-green-400' />
                <span className='text-sm font-medium text-green-800 dark:text-green-200'>
                  API Key Active
                </span>
              </div>
              <p className='text-sm text-green-700 dark:text-green-300 mt-1'>
                Your Google Gemini API key is configured and active. You have
                unlimited processing.
              </p>
            </div>
          )}

          <div className='space-y-6'>
            <div className='relative'>
              <ControlledInput
                name={API_KEY_FORM_FIELD_NAMES.API_KEY}
                label={`Google Gemini API Key${
                  currentTier === AccountTier.BYOK && hasApiKey
                    ? ' (Update)'
                    : ''
                }`}
                type={showApiKey ? 'text' : 'password'}
                placeholder={
                  currentTier === AccountTier.BYOK && hasApiKey
                    ? 'Enter new API key to update'
                    : 'AIzaSyC...'
                }
                disabled={isSubmitting}
                required
                icon={<Key className='w-5 h-5' />}
              />
              <button
                type='button'
                className='absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors'
                onClick={() => setShowApiKey(!showApiKey)}
                disabled={isSubmitting}>
                {showApiKey ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>

            <p className='text-sm text-muted-foreground'>
              Enter your Google Gemini API key to enable unlimited processing
            </p>

            {/* Error Message */}
            {errors.root?.serverError && (
              <div className='p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg'>
                <p className='text-sm text-red-800 dark:text-red-200'>
                  {errors.root.serverError.message}
                </p>
              </div>
            )}

            {/* Success Message */}
            {isSubmitSuccessful && !errors.root?.serverError && (
              <div className='p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg'>
                <p className='text-sm text-green-800 dark:text-green-200'>
                  {currentTier === AccountTier.BYOK && hasApiKey
                    ? API_KEY_SUCCESS_MESSAGES.UPDATED
                    : API_KEY_SUCCESS_MESSAGES.SAVED}
                </p>
              </div>
            )}

            <SubmitButton
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText={
                currentTier === AccountTier.BYOK && hasApiKey
                  ? API_KEY_LOADING_MESSAGES.UPDATING
                  : API_KEY_LOADING_MESSAGES.SAVING
              }
              normalText={
                currentTier === AccountTier.BYOK && hasApiKey
                  ? 'Update API Key'
                  : 'Save API Key & Upgrade to BYOK'
              }
              icon={Key}
              className='w-full'
            />

            {/* Additional Info for Free Tier Users */}
            {currentTier === AccountTier.free && (
              <div className='p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <h4 className='text-sm font-medium text-blue-800 dark:text-blue-200 mb-2'>
                  Benefits of BYOK Tier:
                </h4>
                <ul className='text-sm text-blue-700 dark:text-blue-300 space-y-1'>
                  <li>• Unlimited AI processing</li>
                  <li>• No daily usage limits</li>
                  <li>• Use your own Google Gemini API quota</li>
                  <li>• Priority processing</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
