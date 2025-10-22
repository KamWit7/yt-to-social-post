import { findUserByEmail } from '@/lib/db/users'
import { serverEnv } from '@/lib/env/server-env'
import { prisma } from '@/lib/prisma'
import { ROUTES } from '@/utils/constants'
import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import z from 'zod'
import { EXPIRATION_TIME_ONE_HOUR } from './reset.constatns'
import { sendResetPasswordEmial } from './reset.emial'

const requestResetSchema = z.object({
  email: z.email({ message: 'Wprowadź poprawny adres email' }),
})

export async function POST(request: NextRequest) {
  try {
    const unsafeBody = await request.json()
    const body = requestResetSchema.parse(unsafeBody)

    const user = await findUserByEmail(body.email)

    if (!user) {
      return new Response('Nie znaleziono użytkownika', { status: 404 })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiredAtOneHour = new Date(
      Date.now() + EXPIRATION_TIME_ONE_HOUR
    )

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry: tokenExpiredAtOneHour,
      },
    })

    const resetUrl = `${serverEnv.NEXTAUTH_URL}${ROUTES.NEW_RESET_PASSWORD}?token=${resetToken}`

    await sendResetPasswordEmial({ email: user.email, resetUrl })

    return new Response('Email został wysłany', { status: 200 })
  } catch (error: unknown) {
    return new Response('Błąd podczas wysyłania emaila', {
      status: 400,
      statusText: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
