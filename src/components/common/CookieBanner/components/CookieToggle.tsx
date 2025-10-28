'use client'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useId } from 'react'

interface CookieToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}

export default function CookieToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: CookieToggleProps) {
  const id = useId()

  return (
    <div className='flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0'>
      <div className='flex flex-col'>
        <Label
          htmlFor={id}
          className={`${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
          {label}
        </Label>
        {description && (
          <span className='text-xs text-gray-500 mt-1'>{description}</span>
        )}
      </div>

      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
      />
    </div>
  )
}
