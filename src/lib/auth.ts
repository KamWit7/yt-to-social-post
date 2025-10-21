import { findUserByEmail } from '@/lib/db/users'
import { getGoogleOAuthCredentials, safeEnv } from '@/lib/env/validate-env'
import { prisma } from '@/lib/prisma'
import { ROUTES } from '@/utils/constants'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import { default as CredentialsProvider } from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await findUserByEmail(credentials.email)

        const isEmailValid = credentials.email === user?.email
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user?.password || ''
        )

        if (isEmailValid && isPasswordValid) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        }

        return null
      },
    }),
    GoogleProvider(getGoogleOAuthCredentials()),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },
  debug: safeEnv.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }

      return token
    },
    async session({ session, token }) {
      // Przekazujemy ID z tokena JWT do sesji
      if (token?.id) {
        session.user.id = token.id as string
      }

      return session
    },
  },
  secret: safeEnv.NEXTAUTH_SECRET,
}
