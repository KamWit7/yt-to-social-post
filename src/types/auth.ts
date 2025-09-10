import { AccountTier } from '@prisma/client'
import { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: User & DefaultSession['user']
  }

  interface User {
    id: string
    usage?: {
      accountTier: AccountTier
    }
  }
}
