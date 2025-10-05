import { AccountTier } from '@prisma/client'
import { AIModels } from '../../../Form.constants'
import { isModelAvailable } from '../../PurposeForm.helpers'

export interface ModelOption {
  label: string
  value: string
  disabled: boolean
}

export function generateModelOptions(accountTier: AccountTier): ModelOption[] {
  const isByokUser = accountTier === AccountTier.BYOK

  return [
    {
      label: `${AIModels.Gemini25Pro}${!isByokUser ? ' 🔒' : ''}`,
      value: AIModels.Gemini25Pro,
      disabled: !isModelAvailable(AIModels.Gemini25Pro, accountTier),
    },
    {
      label: AIModels.Gemini25Flash,
      value: AIModels.Gemini25Flash,
      disabled: false,
    },
    {
      label: `${AIModels.Gemini25FlashLite}${!isByokUser ? ' 🔒' : ''}`,
      value: AIModels.Gemini25FlashLite,
      disabled: !isModelAvailable(AIModels.Gemini25FlashLite, accountTier),
    },
  ]
}
