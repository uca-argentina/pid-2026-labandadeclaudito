import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createBlockSchema = z
  .object({
    startDate: z.string().refine(esDiaReal, 'Elegí una fecha válida'),
    endDate: z.string().refine(esDiaReal, 'Elegí una fecha válida'),
    startTime: z.string().regex(timeRegex, 'Formato HH:MM'),
    endTime: z.string().regex(timeRegex, 'Formato HH:MM'),
    reason: z.string().max(200).optional(),
  })
  .refine((data) => data.startDate <= data.endDate, {
    message: 'La fecha de inicio no puede ser posterior a la de fin',
    path: ['endDate'],
  })
  .refine((data) => data.startTime < data.endTime, {
    message: 'El horario de inicio debe ser anterior al de fin',
    path: ['endTime'],
  })

export type CreateBlockInput = z.infer<typeof createBlockSchema>

export const updateBlockSchema = createBlockSchema

export type UpdateBlockInput = z.infer<typeof updateBlockSchema>
