'use client'

import { ControlledSelect } from '@/components/common'
import { useUserAccountTier } from '../AIModelSelect/AIModelSelect.hooks'
import { LoadingOverlay } from '../AIModelSelect/components/LoadingOverlay'
import { PremiumFeatureTooltip } from '../PremiumFeatureTooltip'
import { generateTemperatureModeOptions } from './TemperatureModeSelect.helpers'

interface TemperatureModeSelectProps {
  className?: string
  name: string
  label?: string
  placeholder?: string
}

export function TemperatureModeSelect({
  className = 'w-full',
  name,
  label,
  placeholder,
}: TemperatureModeSelectProps) {
  const { accountTier, isLoading, isByokUser } = useUserAccountTier()
  const temperatureModeOptions = generateTemperatureModeOptions(accountTier)

  return (
    <div className='relative'>
      {isLoading && <LoadingOverlay />}
      <PremiumFeatureTooltip
        isByokUser={isByokUser}
        title='Odblokuj wszystkie temperture'
        description='Tryby temperatury wymagają konta BYOK.'>
        <ControlledSelect
          name={name}
          label={label}
          placeholder={placeholder}
          required
          options={temperatureModeOptions}
          className={className}
        />
      </PremiumFeatureTooltip>
    </div>
  )
}
