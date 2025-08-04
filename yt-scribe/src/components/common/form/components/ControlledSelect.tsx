'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FieldValues, useController } from 'react-hook-form'
import { SelectProps } from '../types/formTypes'
import { FormError } from './FormError'
import { FormField } from './FormField'

export function ControlledSelect<T extends FieldValues>({
  name,
  label,
  placeholder,
  disabled = false,
  required = false,
  className = '',
  options,
}: SelectProps<T>) {
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
      <Select
        disabled={disabled}
        onValueChange={field.onChange}
        value={field.value}
        aria-label={label}
        aria-invalid={!!error}>
        <SelectTrigger id={name} className={className}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
