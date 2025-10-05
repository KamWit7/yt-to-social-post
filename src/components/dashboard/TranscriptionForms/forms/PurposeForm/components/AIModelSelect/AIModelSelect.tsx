'use client'

import { ControlledSelect } from '@/components/common'
import { generateModelOptions } from './AIModelSelect.helpers'
import { useUserAccountTier } from './AIModelSelect.hooks'
import { LoadingOverlay } from './components/LoadingOverlay'
import { PremiumModelTooltip } from './components/PremiumModelTooltip'

interface AIModelSelectProps {
  className?: string
  name: string
  label?: string
  placeholder?: string
}

export function AIModelSelect({
  className = 'w-full',
  name,
  label,
  placeholder,
}: AIModelSelectProps) {
  const { accountTier, isLoading, isByokUser } = useUserAccountTier()
  const modelOptions = generateModelOptions(accountTier)

  return (
    <div className='relative'>
      {isLoading && <LoadingOverlay />}
      <PremiumModelTooltip isByokUser={isByokUser}>
        <ControlledSelect
          name={name}
          label={label}
          placeholder={placeholder}
          required
          options={modelOptions}
          className={className}
        />
      </PremiumModelTooltip>
    </div>
  )
}
