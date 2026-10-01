import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

export const createBookingSchema = z.object({
  canchaId: z.string().min(1),
  fecha: z.string().refine(esDiaReal, 'Fecha inválida'),
  horaInicio: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Formato HH:MM'),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>

export const markAttendanceSchema = z.object({
  asistio: z.boolean(),
})
