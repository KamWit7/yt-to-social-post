import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { NextRequest } from 'next/server'
import z from 'zod'

const newResetPasswordSchema = z
  .object({
    token: z.string(),
    password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
    confirmPassword: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie pasują do siebie',
    path: ['confirmPassword'],
  })

export async function POST(request: NextRequest) {
  try {
    const unsafeBody = await request.json()
    const body = newResetPasswordSchema.parse(unsafeBody)

    const user = await prisma.user.findUnique({
      where: {
        resetToken: body.token,
      },
    })

    if (!user) {
      return new Response('Nie znaleziono użytkownika', { status: 404 })
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return new Response('Link do resetowania hasła wygasł', { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(body.password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    })

    return new Response('Hasło zostało zmienione', { status: 200 })
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return new Response(error.issues[0].message, {
        status: 400,
      })
    }
    return new Response('Błąd podczas resetowania hasła', {
      status: 400,
      statusText: error instanceof Error ? error.message : 'Unknown error',
    })
  }
}
