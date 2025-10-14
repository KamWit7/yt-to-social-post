import { AccountTier } from '@prisma/client'
import {
  DEFAULT_PURPOSE,
  FORM_FIELD_NAMES,
} from '../../TasncriptionForms.constants'
import {
  AIModels,
  DEFAULT_AI_MODEL,
  DEFAULT_LANGUAGE,
  DEFAULT_TEMPERATURE_MODE,
} from '../Form.constants'
import type { PurposeOnlyFormData } from './purposeSchema'

export const getPurposeDefaultValues = (
  existingData?: PurposeOnlyFormData
): PurposeOnlyFormData => ({
  [FORM_FIELD_NAMES.PURPOSE]:
    existingData?.[FORM_FIELD_NAMES.PURPOSE] ?? DEFAULT_PURPOSE,
  [FORM_FIELD_NAMES.LANGUAGE]:
    existingData?.[FORM_FIELD_NAMES.LANGUAGE] ?? DEFAULT_LANGUAGE,
  [FORM_FIELD_NAMES.CUSTOM_PROMPT]:
    existingData?.[FORM_FIELD_NAMES.CUSTOM_PROMPT] ?? '',
  [FORM_FIELD_NAMES.MODEL]:
    existingData?.[FORM_FIELD_NAMES.MODEL] ?? DEFAULT_AI_MODEL,
  [FORM_FIELD_NAMES.TEMPERATURE_MODE]:
    existingData?.[FORM_FIELD_NAMES.TEMPERATURE_MODE] ??
    DEFAULT_TEMPERATURE_MODE,
})

export const isModelAvailable = (
  model: string,
  accountTier: AccountTier
): boolean => {
  if (model === AIModels.Gemini25Flash) {
    return true
  }

  if (accountTier === AccountTier.BYOK) {
    return true
  }

  return false
}
