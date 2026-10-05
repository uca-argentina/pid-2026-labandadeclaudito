import { z } from 'zod'

// Vienen de la URL (?complejoId=...&dias=7): cualquiera puede escribir lo que
// quiera. Un valor inválido no rompe la página: se usa el valor por defecto.
// Que el complejo sea del dueño logueado se chequea en la página, no acá.
export const dashboardFiltersSchema = z.object({
  complejoId: z.string().min(1).optional().catch(undefined),
  dias: z
    .enum(['7', '30'])
    .catch('30')
    .transform((texto) => Number(texto)),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
