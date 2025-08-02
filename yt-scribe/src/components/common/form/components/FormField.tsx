'use client'

import { Label } from '@/components/ui/label'
import { ReactNode } from 'react'
import { FORM_STYLES } from '../constants/formStyles'

interface FormFieldProps {
  label?: string
  required?: boolean
  error?: ReactNode
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  required = false,
  error,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`${FORM_STYLES.container.field} ${className}`}>
      {label && (
        <Label className={`${required ? FORM_STYLES.label.required : ''}`}>
          {label}
        </Label>
      )}
      {children}
      {error && (
        <div className={FORM_STYLES.error.base} role='alert'>
          {error}
        </div>
      )}
    </div>
  )
}
