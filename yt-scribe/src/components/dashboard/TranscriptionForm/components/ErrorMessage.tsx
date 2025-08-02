'use client'

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null

  return (
    <p className='text-red-500 mt-4 text-center' role='alert'>
      {message}
    </p>
  )
}
