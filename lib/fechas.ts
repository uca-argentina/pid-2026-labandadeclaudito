// Fechas escritas en palabras, para mostrar en pantalla. Los días llegan como
// YYYY-MM-DD y se leen en UTC para que no se corran por la zona horaria.
import { nombresDeDias } from '@/lib/labels'
import { diaDeHoy } from '@/lib/time'

const nombresDeMeses = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

// "2026-10-10" → "Sábado 10 de octubre"
export function diaEnPalabras(dia: string): string {
  const mes = Number(dia.slice(5, 7))
  return `${diaYNumero(dia)} de ${nombresDeMeses[mes - 1]}`
}

// "2026-10-13" → "Martes 13", para listas donde el mes sobra
export function diaYNumero(dia: string): string {
  const diaDelMes = Number(dia.slice(8, 10))
  const diaDeLaSemana = nombresDeDias[new Date(`${dia}T00:00:00Z`).getUTCDay()]
  return `${diaDeLaSemana} ${diaDelMes}`
}

// Si el día es hoy o mañana, lo dice; si es otro, devuelve null.
// Recibe hoy por parámetro para poder testear con una fecha fija.
export function diaCercano(dia: string, hoy: string = diaDeHoy()): 'hoy' | 'mañana' | null {
  if (dia === hoy) return 'hoy'

  const maniana = new Date(`${hoy}T00:00:00Z`)
  maniana.setUTCDate(maniana.getUTCDate() + 1)
  if (dia === maniana.toISOString().slice(0, 10)) return 'mañana'

  return null
}

// El sábado más cercano, contando hoy si hoy es sábado (YYYY-MM-DD)
export function proximoSabado(hoy: string = diaDeHoy()): string {
  const fecha = new Date(`${hoy}T00:00:00Z`)
  const SABADO = 6
  const diasHastaElSabado = (SABADO - fecha.getUTCDay() + 7) % 7
  fecha.setUTCDate(fecha.getUTCDate() + diasHastaElSabado)
  return fecha.toISOString().slice(0, 10)
}
