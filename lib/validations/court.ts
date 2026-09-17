import { z } from 'zod'

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/

export const createCourtSchema = z.object({
  nombrePrefijo: z.string().min(1, 'Ingresá un nombre o prefijo').max(60),
  cantidad: z.coerce.number().int().min(1).max(20),
  deporte: z.enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11']),
  tipoSuperficie: z.enum(['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO', 'PARQUET']),
  precioBase: z.coerce.number().positive('El precio debe ser mayor a 0'),
  horaApertura: z.string().regex(horaRegex, 'Formato HH:MM'),
  horaCierre: z.string().regex(horaRegex, 'Formato HH:MM'),
  duracionTurnoMin: z.coerce.number().int().min(30).max(180),
})

export type CreateCourtInput = z.infer<typeof createCourtSchema>

export const updateCourtSchema = z.object({
  nombre: z.string().min(1, 'Ingresá un nombre').max(60),
  deporte: z.enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11']),
  tipoSuperficie: z.enum(['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO', 'PARQUET']),
  precioBase: z.coerce.number().positive('El precio debe ser mayor a 0'),
  horaApertura: z.string().regex(horaRegex, 'Formato HH:MM'),
  horaCierre: z.string().regex(horaRegex, 'Formato HH:MM'),
  duracionTurnoMin: z.coerce.number().int().min(30).max(180),
})

export type UpdateCourtInput = z.infer<typeof updateCourtSchema>
