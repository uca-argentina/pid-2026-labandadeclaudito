import { z } from 'zod'

export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre tiene que tener al menos 2 letras.'),
  email: z.email('Ingresá un email válido.'),
  password: z.string().min(8, 'La contraseña tiene que tener al menos 8 caracteres.'),
  rol: z.enum(['JUGADOR', 'DUENIO']),
})

export type RegisterInput = z.infer<typeof registerSchema>

// El admin suspende (activo: false) o reactiva (activo: true) una cuenta
export const cambiarActivoSchema = z.object({
  activo: z.boolean(),
})
