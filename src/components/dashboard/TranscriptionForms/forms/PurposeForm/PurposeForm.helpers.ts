import { DEFAULT_AI_MODEL, DEFAULT_LANGUAGE } from '@/types'
import {
  DEFAULT_PURPOSE,
  FORM_FIELD_NAMES,
} from '../../constants/formConstants'
import type { PurposeOnlyFormData } from '../../types/formTypes'

export const PurposeDefaultValue: PurposeOnlyFormData = {
  [FORM_FIELD_NAMES.PURPOSE]: DEFAULT_PURPOSE,
  [FORM_FIELD_NAMES.LANGUAGE]: DEFAULT_LANGUAGE,
  [FORM_FIELD_NAMES.CUSTOM_PROMPT]: '',
  [FORM_FIELD_NAMES.MODEL]: DEFAULT_AI_MODEL,
}
