import { z } from 'zod'

export const createDisputeSchema = z.object({
  reservaId: z.string().min(1),
  descripcion: z
    .string()
    .trim()
    .min(20, 'Contanos qué pasó, con al menos 20 caracteres.')
    .max(1000, 'Máximo 1000 caracteres.'),
})

export type CreateDisputeInput = z.infer<typeof createDisputeSchema>

// La resuelve un admin. El comentario es obligatorio: es la explicación que
// después leen el jugador y el dueño en su historial.
export const resolveDisputeSchema = z.object({
  decision: z.enum(['A_FAVOR_JUGADOR', 'A_FAVOR_DUENIO']),
  comentarioAdmin: z
    .string()
    .trim()
    .min(20, 'Explicá la decisión, con al menos 20 caracteres.')
    .max(1000, 'Máximo 1000 caracteres.'),
})

export type ResolveDisputeInput = z.infer<typeof resolveDisputeSchema>

export const MAX_EVIDENCIAS_POR_DISPUTA = 5
export const MAX_EVIDENCIA_BYTES = 4 * 1024 * 1024

// Por ahora solo imágenes: un video no pasa por un endpoint (Vercel corta los
// bodies de más de 4.5 MB) y necesita subida desde el cliente.
export const disputeEvidenceSchema = z.object({
  archivo: z
    .instanceof(File, { message: 'Elegí una imagen.' })
    .refine((archivo) => archivo.size <= MAX_EVIDENCIA_BYTES, {
      message: 'La imagen pesa más de 4 MB.',
    })
    .refine((archivo) => ['image/jpeg', 'image/png', 'image/webp'].includes(archivo.type), {
      message: 'Solo se aceptan imágenes JPG, PNG o WebP.',
    }),
})
