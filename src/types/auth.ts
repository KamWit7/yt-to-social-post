import { AccountTier } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      accountTier: AccountTier
    } & DefaultSession['user']
  }
}
