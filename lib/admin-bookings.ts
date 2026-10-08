import type { EstadoVisible } from '@/lib/estado-reserva'
import { sumarDias } from '@/lib/time'

// Los estados que cuenta y filtra el admin. Son los 7 de estadoDeReserva()
// menos "Asistió", que entra en finalizadas: es una finalizada en la que el
// dueño marcó que el jugador vino.
export type GrupoDeEstado =
  'PENDIENTE' | 'CONFIRMADA' | 'EN_CURSO' | 'FINALIZADA' | 'NO_SHOW' | 'CANCELADA'

// En el orden en que se muestran las tarjetas
export const gruposDeEstado: GrupoDeEstado[] = [
  'PENDIENTE',
  'CONFIRMADA',
  'EN_CURSO',
  'FINALIZADA',
  'NO_SHOW',
  'CANCELADA',
]

export function grupoDelEstado(estado: EstadoVisible): GrupoDeEstado {
  if (estado === 'ASISTIO') return 'FINALIZADA'
  return estado
}

export function contarPorGrupo(grupos: GrupoDeEstado[]): Record<GrupoDeEstado, number> {
  const conteo = {
    PENDIENTE: 0,
    CONFIRMADA: 0,
    EN_CURSO: 0,
    FINALIZADA: 0,
    NO_SHOW: 0,
    CANCELADA: 0,
  }
  for (const grupo of grupos) {
    conteo[grupo]++
  }
  return conteo
}

// Un año como máximo, para no traer la tabla entera de una vez
const DIAS_MAXIMOS = 366

// El período a mostrar. Sin fechas, o con fechas que no tienen sentido (desde
// después de hasta, más de un año), se usa el default: un mes para atrás y
// uno para adelante, así se ven las jugadas y las que vienen.
export function rangoDeFechas(
  desde: string | undefined,
  hasta: string | undefined,
  hoy: string,
): { desde: string; hasta: string } {
  const porDefecto = { desde: sumarDias(hoy, -30), hasta: sumarDias(hoy, 30) }

  if (desde === undefined || hasta === undefined) return porDefecto
  if (desde > hasta) return porDefecto
  if (hasta > sumarDias(desde, DIAS_MAXIMOS - 1)) return porDefecto
  return { desde, hasta }
}

export type FiltrosDeReservas = {
  estado?: GrupoDeEstado
  complejoId?: string
  desde: string
  hasta: string
  pagina?: number
}

// Link a /admin/reservas con esos filtros. Lo que no viene no va en la URL.
export function urlDeReservasGlobales(filtros: FiltrosDeReservas): string {
  const params = new URLSearchParams()
  if (filtros.estado !== undefined) params.set('estado', filtros.estado)
  if (filtros.complejoId !== undefined) params.set('complejoId', filtros.complejoId)
  params.set('desde', filtros.desde)
  params.set('hasta', filtros.hasta)
  if (filtros.pagina !== undefined && filtros.pagina > 1) {
    params.set('pagina', String(filtros.pagina))
  }
  return `/admin/reservas?${params.toString()}`
}
