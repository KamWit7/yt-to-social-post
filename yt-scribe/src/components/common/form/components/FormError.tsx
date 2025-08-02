'use client'

import { FieldError } from 'react-hook-form'
import { FORM_STYLES } from '../constants/formStyles'

interface FormErrorProps {
  error?: FieldError
  className?: string
}

export function FormError({ error, className = '' }: FormErrorProps) {
  if (!error) return null

  return (
    <div className={`${FORM_STYLES.error.base} ${className}`} role='alert'>
      {error.message}
    </div>
  )
}
