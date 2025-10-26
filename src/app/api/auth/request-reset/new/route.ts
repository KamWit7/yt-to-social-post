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
      return new Response(
        JSON.stringify({
          message: 'Upewnij się, że link do resetowania hasła jest poprawny',
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      return new Response(
        JSON.stringify({ message: 'Link do resetowania hasła wygasł' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
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

    return new Response(
      JSON.stringify({ message: 'Hasło zostało zmienione' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error: unknown) {
    return new Response(
      JSON.stringify({ message: 'Błąd podczas resetowania hasła' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
