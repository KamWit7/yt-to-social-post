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
        <SelectTrigger
          id={name}
          className={`transition-all duration-200 ease-in-out hover:shadow-md hover:border-gray-300 focus-within:ring-2 focus-within:ring-gray-500/20 focus-within:border-gray-400 ${className}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='border-gray-200/20 shadow-xl'>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className='hover:bg-gray-50 dark:hover:bg-gray-900/20 transition-colors duration-150'>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  )
}
