'use client'

import { Textarea } from '@/components/ui/textarea'
import { FieldValues, useController } from 'react-hook-form'
import { TextareaProps } from '../types/formTypes'
import { FormError } from './FormError'
import { FormField } from './FormField'

export function ControlledTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  rows = 4,
  maxLength,
}: TextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name })

  return (
    <FormField
      label={label}
      required={required}
      error={error && <FormError error={error} />}
      className={className}>
      <Textarea
        {...field}
        rows={rows}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        aria-invalid={!!error}
      />
    </FormField>
  )
}
