import type { ApiKeyFormData } from './apiKeySchema'

/**
 * Form field names constants for API key form
 */
export const API_KEY_FORM_FIELD_NAMES = {
  API_KEY: 'apiKey',
} as const

/**
 * Default values for API key form
 */
export const getApiKeyDefaultValues = (): ApiKeyFormData => ({
  apiKey: '',
})

/**
 * Loading messages for API key form
 */
export const API_KEY_LOADING_MESSAGES = {
  SAVING: 'Saving API key...',
  UPDATING: 'Updating API key...',
} as const

/**
 * Success messages for API key form
 */
export const API_KEY_SUCCESS_MESSAGES = {
  SAVED:
    'API key saved successfully! Your account has been upgraded to BYOK tier.',
  UPDATED: 'API key updated successfully!',
} as const
