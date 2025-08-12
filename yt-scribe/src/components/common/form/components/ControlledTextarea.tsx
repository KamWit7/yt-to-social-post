'use client'

import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
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
  textareaClassName = '',
  icon,
}: TextareaProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name })

  return (
    <FormField
      name={name}
      label={label}
      required={required}
      error={error && <FormError error={error} />}
      className={className}>
      <div className='relative'>
        <Textarea
          {...field}
          id={name}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!error}
          className={cn(textareaClassName, icon && 'pl-10')}
        />
        {icon && (
          <div className='absolute left-3 top-3 text-muted-foreground pointer-events-none'>
            {icon}
          </div>
        )}
      </div>
    </FormField>
  )
}
