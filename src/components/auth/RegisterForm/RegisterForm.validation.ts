import { z } from 'zod'

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Imię i nazwisko jest wymagane')
      .min(2, 'Imię i nazwisko musi mieć co najmniej 2 znaki'),
    email: z.email({ message: 'Wprowadź poprawny adres email' }),
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

export type RegisterFormData = z.infer<typeof registerSchema>
