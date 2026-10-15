import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

// Filtros de /dueno/reservas. Vienen de la URL (?complejoId=...&deporte=PADEL
// &jugador=ana&desde=...&hasta=...): cualquiera puede escribir lo que quiera.
// Un valor inválido no rompe la página, se ignora. Que el complejo sea del
// dueño lo resuelve el where de la página (filtra por duenioId).
export const ownerBookingsFiltersSchema = z.object({
  // El formulario manda "" cuando se eligen todos los complejos
  complejoId: z.string().min(1).optional().catch(undefined),
  // El formulario manda "" cuando se eligen todos los deportes
  deporte: z
    .enum(['FUTBOL_5', 'FUTBOL_7', 'FUTBOL_11', 'TENIS', 'PADEL', 'BASQUET'])
    .optional()
    .catch(undefined),
  // Búsqueda libre: sin espacios de más, y vacía = sin buscar
  jugador: z.string().trim().min(1).max(100).optional().catch(undefined),
  // Las fechas son opcionales: sin ellas no se limita el período
  desde: z.string().refine(esDiaReal).optional().catch(undefined),
  hasta: z.string().refine(esDiaReal).optional().catch(undefined),
})

export type OwnerBookingsFilters = z.infer<typeof ownerBookingsFiltersSchema>
