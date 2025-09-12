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
  SAVING: 'Zapisywanie klucza API...',
  UPDATING: 'Aktualizowanie klucza API...',
} as const

/**
 * Success messages for API key form
 */
export const API_KEY_SUCCESS_MESSAGES = {
  SAVED:
    'Klucz API zapisany pomyślnie! Twoje konto zostało zaktualizowane do poziomu BYOK.',
  UPDATED: 'Klucz API zaktualizowany pomyślnie!',
} as const
