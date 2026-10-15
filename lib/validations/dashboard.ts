import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

// Vienen de la URL (?complejoId=...&vista=semana&fecha=2026-10-07&deporte=PADEL,
// o con vista=rango: &desde=2026-09-01&hasta=2026-10-07):
// cualquiera puede escribir lo que quiera. Un valor inválido no rompe la
// página: se usa el valor por defecto. Que el complejo sea del dueño, que el
// deporte sea de sus complejos, que las fechas no sean futuras y que el rango
// no sea demasiado largo se chequea en la página (lib/periodos.ts), no acá.
export const dashboardFiltersSchema = z.object({
  complejoId: z.string().min(1).optional().catch(undefined),
  // Se arranca viendo el día de hoy
  vista: z.enum(['dia', 'semana', 'mes', 'rango']).catch('dia'),
  // Cualquier día del período que se quiere ver; sin fecha, hoy
  fecha: z.string().refine(esDiaReal).optional().catch(undefined),
  // Solo con vista=rango
  desde: z.string().refine(esDiaReal).optional().catch(undefined),
  hasta: z.string().refine(esDiaReal).optional().catch(undefined),
  deporte: z
    .enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'])
    .optional()
    .catch(undefined),
})

export type DashboardFilters = z.infer<typeof dashboardFiltersSchema>
