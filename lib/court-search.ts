import { db } from '@/lib/db'
import { getAvailableSlots } from '@/lib/availability'
import { deporteLabels, formatPrecio, superficieLabels } from '@/lib/labels'
import { formatearDia } from '@/lib/time'
import type { Cancha } from '@/lib/generated/prisma/client'
import type { SearchCourtsFilters } from '@/lib/validations/court-search'

// Qué canchas cumplen los filtros que se pueden resolver en la DB. Lo usan la
// búsqueda y el detalle del complejo, para que en los dos lados se vean las
// mismas canchas. Los filtros en undefined no filtran nada.
// Con fecha, el precio no se filtra acá: se mira turno por turno (matchingSlots),
// porque un turno puede tener un precio especial distinto del precio base.
function courtFilter(filtros: SearchCourtsFilters) {
  const filtraPorPrecioBase = filtros.fecha === undefined

  return {
    activo: true,
    deporte: filtros.deporte,
    tipoSuperficie: filtros.tipoSuperficie,
    precioBase: filtraPorPrecioBase
      ? { gte: filtros.precioMin, lte: filtros.precioMax }
      : undefined,
  }
}

type SlotConPrecio = { horaInicio: string; disponible: boolean; precio: number }

// De los turnos de una cancha en un día, los que sirven para el jugador: libres,
// que empiecen dentro de la ventana [horaDesde, horaHasta) y con el precio en
// rango. Si la lista que devuelve está vacía, la cancha no cumple el filtro.
export function matchingSlots(
  slots: SlotConPrecio[],
  filtros: SearchCourtsFilters,
): SlotConPrecio[] {
  const turnosQueCumplen: SlotConPrecio[] = []

  for (const slot of slots) {
    if (!slot.disponible) continue
    if (filtros.horaDesde !== undefined && slot.horaInicio < filtros.horaDesde) continue
    if (filtros.horaHasta !== undefined && slot.horaInicio >= filtros.horaHasta) continue
    if (filtros.precioMin !== undefined && slot.precio < filtros.precioMin) continue
    if (filtros.precioMax !== undefined && slot.precio > filtros.precioMax) continue

    turnosQueCumplen.push(slot)
  }

  return turnosQueCumplen
}

// Las zonas que el jugador puede elegir: solo las de complejos que tienen
// alguna cancha activa, porque los demás nunca aparecen en los resultados.
export async function getSearchableZones() {
  const complejos = await db.complejo.findMany({
    where: { activo: true, canchas: { some: { activo: true } } },
    distinct: ['zona'],
    select: { zona: true },
    orderBy: { zona: 'asc' },
  })

  const zonas: string[] = []
  for (const complejo of complejos) {
    zonas.push(complejo.zona)
  }
  return zonas
}

// priceFrom: lo que se muestra como "desde $X". Con fecha es el turno más barato
// que cumple los filtros ese día; sin fecha, el precio base de la cancha.
export type CourtWithPrice = Cancha & { priceFrom: number }

// Sin fecha no hay nada que calcular. Con fecha se consulta la disponibilidad
// real de cada cancha (reservas, bloqueos y turnos que ya pasaron) y se dejan
// solo las que tienen algún turno que cumple ventana y precio. Las canchas se
// consultan en paralelo porque cada una son varias consultas a la DB.
async function courtsThatMatch(
  canchas: Cancha[],
  filtros: SearchCourtsFilters,
): Promise<CourtWithPrice[]> {
  const fecha = filtros.fecha
  if (fecha === undefined) {
    return canchas.map((cancha) => ({ ...cancha, priceFrom: Number(cancha.precioBase) }))
  }

  const canchasConTurnos = await Promise.all(
    canchas.map(async (cancha) => {
      const disponibilidad = await getAvailableSlots(cancha.id, new Date(fecha))
      if (disponibilidad === null) return null

      const slots = disponibilidad.slots.map((slot) => ({
        horaInicio: slot.horaInicio,
        disponible: slot.disponible,
        precio: Number(slot.precio),
      }))
      const turnos = matchingSlots(slots, filtros)
      if (turnos.length === 0) return null

      let precioMasBajo = turnos[0].precio
      for (const turno of turnos) {
        if (turno.precio < precioMasBajo) {
          precioMasBajo = turno.precio
        }
      }
      return { ...cancha, priceFrom: precioMasBajo }
    }),
  )

  const resultado: CourtWithPrice[] = []
  for (const cancha of canchasConTurnos) {
    if (cancha !== null) {
      resultado.push(cancha)
    }
  }
  return resultado
}

export async function searchComplexes(filtros: SearchCourtsFilters) {
  // El filtro de la DB va dos veces: en el `some` decide qué complejos pueden
  // aparecer, y en el `include` deja solo las canchas que lo cumplen. Después,
  // con fecha, courtsThatMatch descarta las que no tienen turno libre y los
  // complejos que se quedan sin canchas.
  const complejos = await db.complejo.findMany({
    where: {
      // La zona es texto libre: "CABA" y "caba" son la misma zona
      zona: filtros.zona === undefined ? undefined : { equals: filtros.zona, mode: 'insensitive' },
      activo: true,
      canchas: { some: courtFilter(filtros) },
    },
    include: {
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' }, take: 1 },
      canchas: { where: courtFilter(filtros), orderBy: { nombre: 'asc' } },
    },
    orderBy: { nombre: 'asc' },
  })

  const complejosConCanchas = await Promise.all(
    complejos.map(async (complejo) => ({
      ...complejo,
      canchas: await courtsThatMatch(complejo.canchas, filtros),
    })),
  )

  return complejosConCanchas.filter((complejo) => complejo.canchas.length > 0)
}

// Detalle de un complejo mostrando solo las canchas que cumplen los filtros
// con los que el jugador llegó desde la búsqueda.
export async function getComplexDetail(id: string, filtros: SearchCourtsFilters) {
  const complejo = await db.complejo.findFirst({
    where: { id, activo: true },
    include: {
      canchas: { where: courtFilter(filtros), orderBy: { nombre: 'asc' } },
      imagenes: { where: { activo: true }, orderBy: { orden: 'asc' } },
    },
  })
  if (!complejo) return null

  return { ...complejo, canchas: await courtsThatMatch(complejo.canchas, filtros) }
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
  if (filtros.fecha !== undefined) params.set('fecha', filtros.fecha)
  if (filtros.horaDesde !== undefined) params.set('horaDesde', filtros.horaDesde)
  if (filtros.horaHasta !== undefined) params.set('horaHasta', filtros.horaHasta)

  const texto = params.toString()
  return texto === '' ? '' : `?${texto}`
}

// Un filtro aplicado como "chip" (ej: "Deporte: Pádel"). withoutIt son los
// filtros que quedan al quitarlo: con eso la página arma el link de la "x".
export type FilterChip = { label: string; withoutIt: SearchCourtsFilters }

export function activeFilterChips(filtros: SearchCourtsFilters): FilterChip[] {
  const chips: FilterChip[] = []

  if (filtros.zona !== undefined) {
    chips.push({ label: `Zona: ${filtros.zona}`, withoutIt: { ...filtros, zona: undefined } })
  }
  if (filtros.deporte !== undefined) {
    chips.push({
      label: `Deporte: ${deporteLabels[filtros.deporte]}`,
      withoutIt: { ...filtros, deporte: undefined },
    })
  }
  if (filtros.tipoSuperficie !== undefined) {
    chips.push({
      label: `Superficie: ${superficieLabels[filtros.tipoSuperficie]}`,
      withoutIt: { ...filtros, tipoSuperficie: undefined },
    })
  }
  if (filtros.precioMin !== undefined) {
    chips.push({
      label: `Precio mínimo: ${formatPrecio(filtros.precioMin)}`,
      withoutIt: { ...filtros, precioMin: undefined },
    })
  }
  if (filtros.precioMax !== undefined) {
    chips.push({
      label: `Precio máximo: ${formatPrecio(filtros.precioMax)}`,
      withoutIt: { ...filtros, precioMax: undefined },
    })
  }
  if (filtros.fecha !== undefined) {
    // Sin fecha el horario no significa nada, así que se va junto con ella
    chips.push({
      label: `Fecha: ${formatearDia(filtros.fecha)}`,
      withoutIt: { ...filtros, fecha: undefined, horaDesde: undefined, horaHasta: undefined },
    })
  }
  if (filtros.horaDesde !== undefined || filtros.horaHasta !== undefined) {
    let ventana = `${filtros.horaDesde} a ${filtros.horaHasta}`
    if (filtros.horaHasta === undefined) ventana = `desde ${filtros.horaDesde}`
    if (filtros.horaDesde === undefined) ventana = `hasta ${filtros.horaHasta}`

    chips.push({
      label: `Horario: ${ventana}`,
      withoutIt: { ...filtros, horaDesde: undefined, horaHasta: undefined },
    })
  }

  return chips
}
