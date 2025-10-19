import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email jest wymagany')
    .email({ message: 'Wprowadź poprawny adres email' }),
  password: z.string().min(1, 'Hasło jest wymagane'),
})

export type LoginFormData = z.infer<typeof loginSchema>
