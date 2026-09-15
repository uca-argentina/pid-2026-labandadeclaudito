import { z } from 'zod'

export const registerSchema = z.object({
  nombre: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
  rol: z.enum(['JUGADOR', 'DUENIO']),
})

export type RegisterInput = z.infer<typeof registerSchema>
