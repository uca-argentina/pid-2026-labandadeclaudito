import { z } from 'zod'

export const createBookingSchema = z.object({
  canchaId: z.string().min(1),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato YYYY-MM-DD'),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM'),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
