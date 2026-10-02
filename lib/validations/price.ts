import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createPriceSchema = z
  .object({
    // null = todos los días de la semana
    diaSemana: z
      .number()
      .int()
      .min(0, 'Domingo a sábado, 0 a 6')
      .max(6, 'Domingo a sábado, 0 a 6')
      .nullable(),
    // null junto con horaFin = todo el día
    horaInicio: z.string().regex(timeRegex, 'Formato HH:MM').nullable(),
    horaFin: z.string().regex(timeRegex, 'Formato HH:MM').nullable(),
    precio: z.coerce.number().positive('El precio debe ser mayor a 0'),
  })
  .refine((data) => (data.horaInicio === null) === (data.horaFin === null), {
    message: 'Cargá las dos horas de la franja, o dejá las dos vacías',
    path: ['horaFin'],
  })
  .refine((data) => data.horaInicio === null || data.horaInicio < data.horaFin!, {
    message: 'El horario de inicio debe ser anterior al de fin',
    path: ['horaFin'],
  })

export type CreatePriceInput = z.infer<typeof createPriceSchema>

export const updatePriceSchema = createPriceSchema

export type UpdatePriceInput = z.infer<typeof updatePriceSchema>
