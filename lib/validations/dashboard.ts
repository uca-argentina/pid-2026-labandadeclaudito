import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

// Vienen de la URL (?complejoId=...&vista=semana&fecha=2026-10-07&deporte=PADEL):
// cualquiera puede escribir lo que quiera. Un valor inválido no rompe la
// página: se usa el valor por defecto. Que el complejo sea del dueño, que el
// deporte sea de sus complejos y que la fecha no sea futura se chequea en la
// página, no acá.
export const dashboardFiltersSchema = z.object({
  complejoId: z.string().min(1).optional().catch(undefined),
  // Se arranca viendo el día de hoy
  vista: z.enum(['dia', 'semana', 'mes']).catch('dia'),
  // Cualquier día del período que se quiere ver; sin fecha, hoy
  fecha: z.string().refine(esDiaReal).optional().catch(undefined),
  deporte: z
    .enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'])
    .optional()
    .catch(undefined),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
