import {
  Account,
  Session,
  User,
  UserUsage,
  VerificationToken,
} from '@prisma/client'

// Re-export Prisma types for easier importing
export type { Account, Session, User, UserUsage, VerificationToken }

// Extended types with relations
export type UserWithUsage = User & {
  usage?: UserUsage | null
}

export type SessionWithUser = Session & {
  user: User
}

export type UserUsageStats = {
  current: number
  limit: number
  remaining: number
  percentage: number
}

export type UsageTrackingResult = {
  success: boolean
  usage: {
    current: number
    limit: number
  }
  error?: string
}
