import { nombresCortosDeDias, nombresCortosDeMeses, nombresDeMeses } from '@/lib/labels'
import { sumarDias } from '@/lib/time'

// Períodos de calendario del dashboard del dueño: un día, una semana (de
// lunes a domingo) o un mes. Las fechas son días YYYY-MM-DD, como en lib/time.ts.

export type Vista = 'dia' | 'semana' | 'mes'

export type Periodo = { desde: string; hasta: string }

// 0 (domingo) a 6 (sábado). Se lee en UTC para que la zona del servidor no
// corra el día.
export function diaSemanaDe(dia: string): number {
  return new Date(`${dia}T00:00:00Z`).getUTCDay()
}

function primeroDelMes(anio: number, mes: number): string {
  // Date.UTC acomoda solo los meses fuera de rango (mes 0 → diciembre anterior)
  return new Date(Date.UTC(anio, mes - 1, 1)).toISOString().slice(0, 10)
}

// El período (de la vista elegida) que contiene a la fecha
export function periodoQueContiene(fecha: string, vista: Vista): Periodo {
  if (vista === 'dia') return { desde: fecha, hasta: fecha }

  if (vista === 'semana') {
    // Cuántos días pasaron desde el lunes (el domingo es el último de la semana)
    const desdeElLunes = (diaSemanaDe(fecha) + 6) % 7
    const lunes = sumarDias(fecha, -desdeElLunes)
    return { desde: lunes, hasta: sumarDias(lunes, 6) }
  }

  const anio = Number(fecha.slice(0, 4))
  const mes = Number(fecha.slice(5, 7))
  const desde = primeroDelMes(anio, mes)
  // El último día del mes es el anterior al primero del mes siguiente
  const hasta = sumarDias(primeroDelMes(anio, mes + 1), -1)
  return { desde, hasta }
}

// Una fecha del período de al lado (paso -1: el anterior, 1: el siguiente)
export function fechaDelPeriodoVecino(fecha: string, vista: Vista, paso: 1 | -1): string {
  if (vista === 'dia') return sumarDias(fecha, paso)
  if (vista === 'semana') return sumarDias(fecha, 7 * paso)

  const anio = Number(fecha.slice(0, 4))
  const mes = Number(fecha.slice(5, 7))
  return primeroDelMes(anio, mes + paso)
}

// Los días de la semana (0 = domingo) que tiene el período, sin repetir
export function diasDeLaSemanaDe(periodo: Periodo): number[] {
  const dias: number[] = []
  for (let i = 0; i < Math.min(cantidadDeDias(periodo), 7); i++) {
    dias.push(diaSemanaDe(sumarDias(periodo.desde, i)))
  }
  return dias
}

export function cantidadDeDias(periodo: Periodo): number {
  const desde = new Date(`${periodo.desde}T00:00:00Z`).getTime()
  const hasta = new Date(`${periodo.hasta}T00:00:00Z`).getTime()
  return Math.round((hasta - desde) / (24 * 60 * 60 * 1000)) + 1
}

function diaCorto(dia: string): string {
  const numero = Number(dia.slice(8, 10))
  const mes = nombresCortosDeMeses[Number(dia.slice(5, 7)) - 1]
  return `${numero} ${mes}`
}

// El nombre que se muestra en el selector: "Hoy", "Esta semana", "Septiembre 2026"...
export function nombreDelPeriodo(fecha: string, vista: Vista, hoy: string): string {
  const periodo = periodoQueContiene(fecha, vista)
  const periodoDeHoy = periodoQueContiene(hoy, vista)
  const periodoPasado = periodoQueContiene(fechaDelPeriodoVecino(hoy, vista, -1), vista)

  if (vista === 'dia') {
    if (periodo.desde === periodoDeHoy.desde) return 'Hoy'
    if (periodo.desde === periodoPasado.desde) return 'Ayer'
    return `${nombresCortosDeDias[diaSemanaDe(fecha)]} ${diaCorto(fecha)}`
  }

  if (vista === 'semana') {
    if (periodo.desde === periodoDeHoy.desde) return 'Esta semana'
    if (periodo.desde === periodoPasado.desde) return 'Semana pasada'
    return `${diaCorto(periodo.desde)} – ${diaCorto(periodo.hasta)}`
  }

  if (periodo.desde === periodoDeHoy.desde) return 'Este mes'
  const mes = nombresDeMeses[Number(periodo.desde.slice(5, 7)) - 1]
  return `${mes} ${periodo.desde.slice(0, 4)}`
}

// Contra qué se compara cada vista (para los textos de "vs. ...")
export const comparacionDeLaVista: Record<Vista, string> = {
  dia: 'el día anterior',
  semana: 'la semana anterior',
  mes: 'el mes anterior',
}

// Las fechas del período, cortas: "07/10/2026" si es un día, "05/10 al 11/10" si no
export function rangoDelPeriodo(periodo: Periodo): string {
  const [anio, mes, dia] = periodo.desde.split('-')
  if (periodo.desde === periodo.hasta) return `${dia}/${mes}/${anio}`

  const [, mesHasta, diaHasta] = periodo.hasta.split('-')
  return `${dia}/${mes} al ${diaHasta}/${mesHasta}`
}

export const nombreDelAnterior: Record<Vista, string> = {
  dia: 'Día anterior',
  semana: 'Semana anterior',
  mes: 'Mes anterior',
}

// Los dos rangos que se comparan. Un período que todavía está en curso (esta
// semana, este mes) se mide hasta hoy, y se compara contra el mismo tramo del
// anterior: del 1 al 7 de este mes contra del 1 al 7 del mes pasado. Comparar
// medio mes contra un mes entero haría parecer que siempre se va peor.
export function rangosAComparar(
  fecha: string,
  vista: Vista,
  hoy: string,
): { actual: Periodo; anterior: Periodo } {
  const periodo = periodoQueContiene(fecha, vista)
  const actual = { desde: periodo.desde, hasta: periodo.hasta < hoy ? periodo.hasta : hoy }

  const periodoAnterior = periodoQueContiene(fechaDelPeriodoVecino(periodo.desde, vista, -1), vista)
  // Si el período ya terminó, se compara contra el anterior entero
  if (periodo.hasta <= hoy) return { actual, anterior: periodoAnterior }

  const mismoTramo = sumarDias(periodoAnterior.desde, cantidadDeDias(actual) - 1)
  const anterior = {
    desde: periodoAnterior.desde,
    hasta: mismoTramo < periodoAnterior.hasta ? mismoTramo : periodoAnterior.hasta,
  }

  return { actual, anterior }
}
