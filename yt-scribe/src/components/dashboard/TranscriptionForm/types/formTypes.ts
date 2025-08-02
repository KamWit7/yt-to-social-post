import { z } from 'zod'
import { transcriptionSchema } from '../schemas/transcriptionSchema'

export type TranscriptionFormData = z.infer<typeof transcriptionSchema>

import { Control, FieldErrors } from 'react-hook-form'

export interface FormFieldsProps {
  control: Control<TranscriptionFormData>
  errors: FieldErrors<TranscriptionFormData>
  isLoading: boolean
}

export interface SubmitButtonProps {
  isLoading: boolean
  isValid: boolean
  onSubmit: () => void
}

export interface ErrorMessageProps {
  message: string
}
