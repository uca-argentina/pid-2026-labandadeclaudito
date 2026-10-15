import { z } from 'zod'
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from '@/lib/validations/complex'

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

// Lo que el jugador o el dueño pueden cambiar de su propio perfil.
// telefono y dni son opcionales en la DB: el form manda null cuando están vacíos.
export const updateProfileSchema = z.object({
  nombre: z.string().trim().min(2, 'El nombre tiene que tener al menos 2 letras.'),
  email: z.email('Ingresá un email válido.'),
  telefono: z
    .string()
    .trim()
    .min(6, 'Ingresá un teléfono con característica. Ej: 11 4589-2231')
    .max(30, 'El teléfono es muy largo.')
    .nullable(),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,10}$/, 'El DNI son solo números, entre 7 y 10 dígitos.')
    .nullable(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

// La foto de perfil: mismos límites que las fotos de un complejo
export const avatarSchema = z.object({
  imagen: z
    .instanceof(File, { message: 'Elegí una imagen.' })
    .refine((archivo) => archivo.size <= MAX_IMAGE_BYTES, {
      message: 'La foto pesa más de 4 MB.',
    })
    .refine((archivo) => ALLOWED_IMAGE_TYPES.includes(archivo.type), {
      message: 'Solo se aceptan fotos JPG, PNG o WebP.',
    }),
})
