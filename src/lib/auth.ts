import { findUserByEmail } from '@/lib/db/users'
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

        // Look up user in database
        const user = await findUserByEmail(credentials.email)
        console.log('user', user)

        if (
          credentials.email === user?.email &&
          user?.password &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return {
            id: user?.id,
            email: user?.email,
            name: user?.name,
            image: user?.image,
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  session: {
    strategy: 'database',
  },
  pages: {
    signIn: ROUTES.LOGIN,
    error: ROUTES.LOGIN,
  },
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
}
