import { z } from 'zod'
import { purposeSchema } from '../forms/PurposeForm/purposeSchema'
import { transcriptSchema } from '../forms/TranscriptForm/transcriptSchema'
import { youtubeSchema } from '../forms/YouTubeForm/youtubeSchema'

// Combine all form types into one complete type
export type TranscriptionFormData = z.infer<typeof youtubeSchema> &
  z.infer<typeof transcriptSchema> &
  z.infer<typeof purposeSchema>
export type YouTubeFormData = z.infer<typeof youtubeSchema>
export type TranscriptOnlyFormData = z.infer<typeof transcriptSchema>
export type PurposeOnlyFormData = z.infer<typeof purposeSchema>

import { Control, FieldErrors } from 'react-hook-form'

export interface FormFieldsProps {
  control: Control<TranscriptionFormData>
  errors: FieldErrors<TranscriptionFormData>
  isLoading: boolean
  isTranscriptLoading?: boolean
}

export interface SubmitButtonProps {
  isLoading: boolean
  isValid: boolean
  onSubmit: () => void
}

export interface ErrorMessageProps {
  message: string
}
