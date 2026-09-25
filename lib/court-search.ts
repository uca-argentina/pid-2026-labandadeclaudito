import { db } from '@/lib/db'
import type { SearchCourtsFilters } from '@/lib/validations/court-search'

// Qué canchas cumplen los filtros. Lo usan la búsqueda y el detalle del
// complejo, para que en los dos lados se vean las mismas canchas.
// Los filtros en undefined no filtran nada.
function courtFilter(filtros: SearchCourtsFilters) {
  return {
    activo: true,
    deporte: filtros.deporte,
    tipoSuperficie: filtros.tipoSuperficie,
    precioBase: { gte: filtros.precioMin, lte: filtros.precioMax },
  }
}

export async function searchComplexes(filtros: SearchCourtsFilters) {
  // El filtro de canchas va dos veces: en el `some` decide qué complejos
  // aparecen, y en el `include` deja solo las canchas que lo cumplen (así
  // "desde $X" y la cantidad de canchas reflejan lo filtrado).
  return db.complejo.findMany({
    where: {
      zona: filtros.zona,
      activo: true,
      canchas: { some: courtFilter(filtros) },
    },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 },
      canchas: { where: courtFilter(filtros) },
    },
    orderBy: { nombre: 'asc' },
  })
}

// Detalle de un complejo mostrando solo las canchas que cumplen los filtros
// con los que el jugador llegó desde la búsqueda.
export async function getComplexDetail(id: string, filtros: SearchCourtsFilters) {
  return db.complejo.findFirst({
    where: { id, activo: true },
    include: {
      canchas: { where: courtFilter(filtros), orderBy: { nombre: 'asc' } },
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' } },
    },
  })
}

// Los filtros como texto para la URL (?deporte=PADEL&precioMax=30000), para
// pasarlos de la búsqueda al detalle y de vuelta. Vacío si no hay ninguno.
export function filtersToQueryString(filtros: SearchCourtsFilters): string {
  const params = new URLSearchParams()

  if (filtros.zona !== undefined) params.set('zona', filtros.zona)
  if (filtros.deporte !== undefined) params.set('deporte', filtros.deporte)
  if (filtros.tipoSuperficie !== undefined) params.set('tipoSuperficie', filtros.tipoSuperficie)
  if (filtros.precioMin !== undefined) params.set('precioMin', String(filtros.precioMin))
  if (filtros.precioMax !== undefined) params.set('precioMax', String(filtros.precioMax))

  const texto = params.toString()
  return texto === '' ? '' : `?${texto}`
}
