import { useFormContext } from 'react-hook-form'

export function useFormField() {
  const form = useFormContext()

  if (!form) {
    throw new Error('useFormField must be used within a FormProvider')
  }

  return form
}
