import { findUserByEmail } from '@/lib/db/users'
import { getGoogleOAuthCredentials, serverEnv } from '@/lib/env/server'
import { prisma } from '@/lib/prisma'
import { ROUTES } from '@/utils/constants'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
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

        if (
          credentials.email === user?.email &&
          user?.password &&
          // TODO: check if compare is even needed
          (await bcrypt.compare(credentials.password, user.password))
        ) {
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
  debug: serverEnv.NODE_ENV === 'development',
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
  secret: serverEnv.NEXTAUTH_SECRET,
}
