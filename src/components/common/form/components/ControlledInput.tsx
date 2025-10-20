'use client'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { FieldValues, useController } from 'react-hook-form'
import { getInputClasses } from '../constants/formStyles'
import { InputProps } from '../types/formTypes'
import { FormError } from './FormError'
import { FormField } from './FormField'

export function ControlledInput<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  icon,
  type = 'text',
  autoComplete,
}: InputProps<T>) {
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
        <Input
          {...field}
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-label={typeof label === 'string' ? label : undefined}
          aria-invalid={!!error}
          className={cn(getInputClasses(!!icon))}
        />
        {icon && (
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
            {icon}
          </div>
        )}
      </div>
    </FormField>
  )
}
