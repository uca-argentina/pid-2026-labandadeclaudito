import { z } from 'zod'

// Vienen de la URL (?zona=...&deporte=...): cualquiera puede escribir lo que
// quiera. Un valor inválido o vacío no debe romper la búsqueda, se ignora
// (.catch(undefined)) y es como si ese filtro no estuviera.
export const searchCourtsSchema = z.object({
  zona: z.string().min(1).optional().catch(undefined),
  deporte: z
    .enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL'])
    .optional()
    .catch(undefined),
  tipoSuperficie: z
    .enum(['CESPED_SINTETICO', 'CESPED_NATURAL', 'CEMENTO', 'PARQUET', 'POLVO_DE_LADRILLO'])
    .optional()
    .catch(undefined),
  precioMin: z
    .string()
    .regex(/^\d+$/)
    .transform((texto) => Number(texto))
    .optional()
    .catch(undefined),
  precioMax: z
    .string()
    .regex(/^\d+$/)
    .transform((texto) => Number(texto))
    .optional()
    .catch(undefined),
})

export type SearchCourtsFilters = z.infer<typeof searchCourtsSchema>
