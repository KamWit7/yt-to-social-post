import { z } from 'zod'

export const resetPasswordSchema = z.object({
  email: z.email({ message: 'Wprowadź poprawny adres email' }),
})

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
