import { z } from 'zod'

// Vienen de la URL (?complejoId=...&dias=7&deporte=PADEL): cualquiera puede
// escribir lo que quiera. Un valor inválido no rompe la página: se usa el
// valor por defecto. Que el complejo sea del dueño logueado y que el deporte
// sea de ese complejo se chequea en la página, no acá.
export const dashboardFiltersSchema = z.object({
  complejoId: z.string().min(1).optional().catch(undefined),
  dias: z
    .enum(['7', '30', '90'])
    .catch('30')
    .transform((texto) => Number(texto)),
  deporte: z
    .enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'])
    .optional()
    .catch(undefined),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
