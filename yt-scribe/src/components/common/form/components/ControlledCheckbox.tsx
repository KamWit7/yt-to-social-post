'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@radix-ui/react-label'
import { FieldValues, useController } from 'react-hook-form'
import { CheckboxProps } from '../types/formTypes'
import { FormError } from './FormError'
import { FormField } from './FormField'

export function ControlledCheckbox<T extends FieldValues>({
  name,
  label,
  disabled = false,
  required = false,
  className = '',
}: CheckboxProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ name })

  return (
    <FormField
      name={name}
      required={required}
      error={error && <FormError error={error} />}
      className={className}>
      <div className='flex items-end space-x-2'>
        <Checkbox
          id={name}
          checked={field.value}
          onCheckedChange={field.onChange}
          disabled={disabled}
          aria-label={label}
          aria-invalid={!!error}
        />
        {label && (
          <Label
            htmlFor={name}
            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
            {label}
          </Label>
        )}
      </div>
    </FormField>
  )
}
