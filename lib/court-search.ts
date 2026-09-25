import { db } from '@/lib/db'
import type { SearchCourtsFilters } from '@/lib/validations/court-search'

export async function searchComplexes(filtros: SearchCourtsFilters) {
  // Los filtros de cancha se usan dos veces: para elegir qué complejos aparecen
  // y para traer solo las canchas que los cumplen (así "desde $X" y la cantidad
  // de canchas reflejan lo filtrado). Los filtros en undefined no filtran nada.
  const filtroDeCanchas = {
    activo: true,
    deporte: filtros.deporte,
    tipoSuperficie: filtros.tipoSuperficie,
    precioBase: { gte: filtros.precioMin, lte: filtros.precioMax },
  }

  return db.complejo.findMany({
    where: {
      zona: filtros.zona,
      activo: true,
      canchas: { some: filtroDeCanchas },
    },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 },
      canchas: { where: filtroDeCanchas },
    },
    orderBy: { nombre: 'asc' },
  })
}
