import type { Deporte } from '@/lib/generated/prisma/client'
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
  deporte?: Deporte
  // Texto a buscar en el nombre o el email del jugador
  jugador?: string
  desde: string
  hasta: string
  pagina?: number
}

// Link a /admin/reservas con esos filtros. Lo que no viene no va en la URL.
export function urlDeReservasGlobales(filtros: FiltrosDeReservas): string {
  const params = new URLSearchParams()
  if (filtros.estado !== undefined) params.set('estado', filtros.estado)
  if (filtros.complejoId !== undefined) params.set('complejoId', filtros.complejoId)
  if (filtros.deporte !== undefined) params.set('deporte', filtros.deporte)
  if (filtros.jugador !== undefined) params.set('jugador', filtros.jugador)
  params.set('desde', filtros.desde)
  params.set('hasta', filtros.hasta)
  if (filtros.pagina !== undefined && filtros.pagina > 1) {
    params.set('pagina', String(filtros.pagina))
  }
  return `/admin/reservas?${params.toString()}`
}

// Una reserva reducida a lo que usa el panel del admin
export type ReservaResumida = {
  dia: string
  grupo: GrupoDeEstado
  precio: number
}

export type ResumenDeReservas = {
  // Las que siguen en pie (todas menos las canceladas) y lo que suman
  reservas: number
  monto: number
  // Canceladas sobre el total, para la tasa de cancelación
  canceladas: number
  total: number
  // Ausentes sobre los turnos que ya terminaron, para la tasa de ausencias
  ausentes: number
  terminadas: number
}

export function resumirReservas(lista: ReservaResumida[]): ResumenDeReservas {
  const resumen = { reservas: 0, monto: 0, canceladas: 0, total: 0, ausentes: 0, terminadas: 0 }

  for (const reserva of lista) {
    resumen.total++

    if (reserva.grupo === 'CANCELADA') {
      resumen.canceladas++
      continue
    }

    resumen.reservas++
    resumen.monto += reserva.precio

    if (reserva.grupo === 'FINALIZADA') {
      resumen.terminadas++
    }
    if (reserva.grupo === 'NO_SHOW') {
      resumen.terminadas++
      resumen.ausentes++
    }
  }

  return resumen
}

// Cuántas reservas en pie hubo cada día, empezando por desde. Las canceladas
// no cuentan: el gráfico muestra turnos que se juegan.
export function reservasDiaPorDia(lista: ReservaResumida[], desde: string, dias: number): number[] {
  const fechas: string[] = []
  const totales: number[] = []
  for (let i = 0; i < dias; i++) {
    fechas.push(sumarDias(desde, i))
    totales.push(0)
  }

  for (const reserva of lista) {
    if (reserva.grupo === 'CANCELADA') continue
    const posicion = fechas.indexOf(reserva.dia)
    if (posicion !== -1) totales[posicion]++
  }

  return totales
}

// Un porcentaje para mostrar. Con casos que no llegan al 1% dice "<1%" en vez
// de "0%" (que haría creer que no hubo ninguno). Sin total no hay tasa: "—".
export function tasa(parte: number, total: number): string {
  if (total === 0) return '—'
  const porcentaje = Math.round((parte / total) * 100)
  if (parte > 0 && porcentaje === 0) return '<1%'
  return `${porcentaje}%`
}

// Cuántos turnos empiezan en cada hora, de la primera a la última hora con
// turnos (las horas del medio sin turnos van en 0). Sin las canceladas.
export function turnosPorHora(
  turnos: { horaInicio: string; grupo: GrupoDeEstado }[],
): { hora: number; total: number }[] {
  const horas: number[] = []
  for (const turno of turnos) {
    if (turno.grupo === 'CANCELADA') continue
    horas.push(Number(turno.horaInicio.slice(0, 2)))
  }
  if (horas.length === 0) return []

  const primera = Math.min(...horas)
  const ultima = Math.max(...horas)
  const resultado: { hora: number; total: number }[] = []
  for (let hora = primera; hora <= ultima; hora++) {
    let total = 0
    for (const horaDelTurno of horas) {
      if (horaDelTurno === hora) total++
    }
    resultado.push({ hora, total })
  }
  return resultado
}
