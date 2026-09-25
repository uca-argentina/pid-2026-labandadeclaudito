import { z } from 'zod'

const horaRegex = /^([01]\d|2[0-3]):[0-5]\d$/

// Que exista de verdad: "2026-02-31" tiene formato de fecha pero no es un día.
function esDiaReal(texto: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false
  const fecha = new Date(`${texto}T00:00:00Z`)
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === texto
}

// Vienen de la URL (?zona=...&deporte=...): cualquiera puede escribir lo que
// quiera. Un valor inválido o vacío no debe romper la búsqueda, se ignora
// (.catch(undefined)) y es como si ese filtro no estuviera.
export const searchCourtsSchema = z
  .object({
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
    fecha: z.string().refine(esDiaReal).optional().catch(undefined),
    horaDesde: z.string().regex(horaRegex).optional().catch(undefined),
    horaHasta: z.string().regex(horaRegex).optional().catch(undefined),
  })
  .transform((filtros) => {
    // La disponibilidad se calcula por día: sin fecha el horario no significa nada
    if (filtros.fecha === undefined) {
      return { ...filtros, horaDesde: undefined, horaHasta: undefined }
    }

    // Una ventana al revés (22 a 18) no tiene turnos posibles: se ignora
    const { horaDesde, horaHasta } = filtros
    if (horaDesde !== undefined && horaHasta !== undefined && horaDesde >= horaHasta) {
      return { ...filtros, horaDesde: undefined, horaHasta: undefined }
    }

    return filtros
  })

export type SearchCourtsFilters = z.infer<typeof searchCourtsSchema>
