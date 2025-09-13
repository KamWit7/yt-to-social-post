'use server'

import { apiKeySchema } from '@/components/settings/ApiKeyForm'
import { API_KEY_FORM_FIELD_NAMES } from '@/components/settings/ApiKeyForm/ApiKeyForm.helpers'
import { checkGeminiApiKey } from '@/utils/checkGeminiApiKey'
import { encrypt } from '@/utils/encryption/encryption'
import { AccountTier, UserUsage } from '@prisma/client'
import console from 'console'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { checkUsageLimit, getUserUsage, incrementUsage } from '../db/usage'
import { serverEnv } from '../env/server'
import { prisma } from '../prisma'
import { DEFAULT_USAGE_LIMIT } from '../usage'

export type UsageBaseResponse = {
  success: boolean
  error?: string
}

export type UsageResponse = UsageBaseResponse & {
  usage: {
    current: number
    limit: number
  } | null
}

export async function trackUserUsage(): Promise<UsageResponse> {
  try {
    const session = await getServerSession(authOptions)

    const userId = session?.user.id

    if (!userId) {
      return {
        success: false,
        usage: null,
        error: 'User not found',
      }
    }

    // Check if user is within limits before incrementing
    const limitCheck = await checkUsageLimit(userId, DEFAULT_USAGE_LIMIT)

    if (!limitCheck.withinLimit) {
      return {
        success: false,
        usage: {
          current: limitCheck.currentUsage,
          limit: limitCheck.limit,
        },
        error: 'Usage limit exceeded',
      }
    }

    // Increment usage
    const updatedUsage = await incrementUsage(userId)

    return {
      success: true,
      usage: {
        current: updatedUsage.summaryCount,
        limit: DEFAULT_USAGE_LIMIT,
      },
    }
  } catch (error) {
    console.error('Error tracking usage:', error)
    return {
      success: false,
      usage: {
        current: 0,
        limit: DEFAULT_USAGE_LIMIT,
      },
      error: 'Failed to track usage',
    }
  }
}

type UsageStats = UsageBaseResponse & {
  usage: {
    current: number
    limit: number
    remaining: number
    percentage: number
    accountTier: AccountTier
  }
}

export async function getUserUsageStats(): Promise<UsageStats> {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return {
      success: false,
      usage: {
        current: 0,
        limit: DEFAULT_USAGE_LIMIT,
        remaining: 0,
        percentage: 0,
        accountTier: AccountTier.free,
      },

      error: 'User not found',
    }
  }

  const usage = await getUserUsage(session?.user.id)

  const current = usage?.summaryCount || 0
  const accountTier = usage?.accountTier || AccountTier.free
  const limit =
    accountTier === AccountTier.BYOK ? Infinity : DEFAULT_USAGE_LIMIT
  const remaining =
    accountTier === AccountTier.BYOK ? Infinity : Math.max(0, limit - current)
  const percentage =
    accountTier === AccountTier.BYOK
      ? 0
      : Math.min(100, (current / limit) * 100)

  return {
    success: true,
    usage: { current, limit, remaining, percentage, accountTier },
  }
}

export type SaveApiKeyAndUpgradeTierResponse = UsageBaseResponse & {
  usage: UserUsage | null
}

export async function saveApiKeyAndUpgradeTier(
  unsafeApiKey: string
): Promise<SaveApiKeyAndUpgradeTierResponse> {
  try {
    const { apiKey } = apiKeySchema.parse({
      [API_KEY_FORM_FIELD_NAMES.API_KEY]: unsafeApiKey,
    })

    const session = await getServerSession(authOptions)

    if (!session?.user.id) {
      return {
        success: false,
        usage: null,
        error: 'User not found',
      }
    }

    const isApiKeyValid = await checkGeminiApiKey(apiKey)

    if (isApiKeyValid instanceof Error) {
      return {
        success: false,
        usage: null,
        error: isApiKeyValid.message,
      }
    }

    const encryptedApiKey = encrypt(apiKey, serverEnv.API_ENCRYPTION_KEY)

    const updatedUsage = await prisma.userUsage.update({
      where: { userId: session.user.id },
      data: {
        apiKey: encryptedApiKey,
        accountTier: AccountTier.BYOK,
      },
    })

    return {
      success: true,
      usage: updatedUsage,
    }
  } catch (error) {
    return {
      success: false,
      usage: null,
      error: `Failed to save API key and upgrade tier: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    }
  }
}

export type GetUserApiKeyResponse = UsageBaseResponse & {
  apiKey: UserUsage['apiKey']
}

export async function getUserApiKey(): Promise<GetUserApiKeyResponse> {
  const session = await getServerSession(authOptions)

  if (!session?.user.id) {
    return {
      apiKey: null,
      success: false,
      error: 'User not found',
    }
  }
  const userUsage = await prisma.userUsage.findUnique({
    where: { userId: session.user.id },
  })

  const { apiKey, accountTier } = userUsage ?? {
    apiKey: null,
    accountTier: AccountTier.free,
  }

  return {
    apiKey: accountTier === AccountTier.BYOK ? apiKey : null,
    success: true,
  }
}
