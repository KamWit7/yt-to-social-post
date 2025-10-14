import { FORM_FIELD_NAMES } from '../../TasncriptionForms.constants'

export const getTranscriptDefaultValues = (transcript: string = '') => ({
  [FORM_FIELD_NAMES.TRANSCRIPT]: transcript,
})
