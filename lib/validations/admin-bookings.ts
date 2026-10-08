import { z } from 'zod'
import { esDiaReal } from '@/lib/time'

// Vienen de la URL (?estado=NO_SHOW&complejoId=...&desde=2026-10-01&hasta=2026-10-31):
// cualquiera puede escribir lo que quiera. Un valor inválido no rompe la
// página: se ignora. Que el rango tenga sentido se chequea en rangoDeFechas()
// (lib/admin-bookings.ts) y que el complejo exista, en la página.
export const adminBookingsFiltersSchema = z.object({
  estado: z
    .enum(['PENDIENTE', 'CONFIRMADA', 'EN_CURSO', 'FINALIZADA', 'NO_SHOW', 'CANCELADA'])
    .optional()
    .catch(undefined),
  // El formulario manda "" cuando se eligen todos los complejos
  complejoId: z.string().min(1).optional().catch(undefined),
  desde: z.string().refine(esDiaReal).optional().catch(undefined),
  hasta: z.string().refine(esDiaReal).optional().catch(undefined),
})
