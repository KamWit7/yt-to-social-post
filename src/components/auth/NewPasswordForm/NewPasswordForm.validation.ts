import { z } from 'zod'

export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Hasło jest wymagane')
      .min(8, 'Hasło musi mieć co najmniej 8 znaków'),
    confirmPassword: z.string().min(1, 'Potwierdź swoje hasło'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie pasują do siebie',
    path: ['confirmPassword'],
  })

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>
