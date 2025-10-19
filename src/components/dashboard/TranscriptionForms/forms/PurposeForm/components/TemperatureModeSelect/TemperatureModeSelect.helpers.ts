import { TemperatureMode } from '@/utils/modelTemperature'
import { AccountTier } from '@prisma/client'

interface TemperatureModeOption {
  label: string
  value: string
  disabled: boolean
}

export function generateTemperatureModeOptions(
  accountTier: AccountTier
): TemperatureModeOption[] {
  const isByokUser = accountTier === AccountTier.BYOK

  return [
    {
      label: `Precyzyjny${!isByokUser ? ' 🔒' : ''}`,
      value: TemperatureMode.PRECISE,
      disabled: !isByokUser,
    },
    {
      label: 'Zrównoważony',
      value: TemperatureMode.BALANCED,
      disabled: false,
    },
    {
      label: `Kreatywny${!isByokUser ? ' 🔒' : ''}`,
      value: TemperatureMode.CREATIVE,
      disabled: !isByokUser,
    },
  ]
}
