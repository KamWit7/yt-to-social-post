import { ROUTES } from '@/utils/constants'
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

export const authOptions: NextAuthOptions = {
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

        // For now, we'll implement a simple check
        // In a real app, you'd validate against a database
        if (
          credentials.email === 'demo@example.com' &&
          credentials.password === 'password'
        ) {
          return {
            id: '1',
            email: credentials.email,
            name: 'Demo User',
          }
        }

        return null
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      //   httpOptions: {
      //     timeout: 10_000,
      //   },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: ROUTES.LOGIN,
    // error: ROUTES.LOGIN,
  },
  //   debug: process.env.NODE_ENV === 'development',
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
