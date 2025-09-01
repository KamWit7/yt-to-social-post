import { FieldPath, FieldValues } from 'react-hook-form'

export interface BaseFormFieldProps<T extends FieldValues> {
  name: FieldPath<T>
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  className?: string
  icon?: React.ReactNode
}

export interface InputProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  type?: 'text' | 'email' | 'password' | 'url' | 'number'
  autoComplete?: string
}

export interface SelectProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  options: Array<{ value: string; label: string }>
}

export interface TextareaProps<T extends FieldValues>
  extends BaseFormFieldProps<T> {
  rows?: number
  maxLength?: number
  textareaClassName?: string
  onChange?: (value: string) => void
}

export type CheckboxProps<T extends FieldValues> = BaseFormFieldProps<T>
