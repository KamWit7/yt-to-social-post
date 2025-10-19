'use client'

import { ControlledSelect } from '@/components/common'
import { PremiumFeatureTooltip } from '../PremiumFeatureTooltip'
import { generateModelOptions } from './AIModelSelect.helpers'
import { useUserAccountTier } from './AIModelSelect.hooks'
import { LoadingOverlay } from './components/LoadingOverlay'

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
      <PremiumFeatureTooltip
        isByokUser={isByokUser}
        title='Odblokuj wszystkie modele AI'
        description='modele wymagają konta BYOK.'>
        <ControlledSelect
          name={name}
          label={label}
          placeholder={placeholder}
          required
          options={modelOptions}
          className={className}
        />
      </PremiumFeatureTooltip>
    </div>
  )
}
