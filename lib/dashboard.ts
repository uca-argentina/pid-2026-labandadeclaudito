import type { Deporte } from '@/lib/generated/prisma/client'

// Cuentas que hace la pantalla del dashboard del dueño con lo que ya devuelve
// metricasDelComplejo (lib/metricas-complejo.ts). No consultan la DB.

export type CeldaDeDemanda = { diaSemana: number; horaInicio: string; reservas: number }

export type Franja = { etiqueta: string; columnas: number; reservas: number }

// Misma forma que MetricasComplejo de lib/metricas-complejo.ts (SCRUM-62):
// lo que devuelve la métrica de un complejo (o de un deporte de un complejo)
// en un período.
export type MetricasDelPeriodo = {
  ocupacion: { turnosReservados: number; turnosOfrecidos: number; porcentaje: number }
  ingresos: number
  cancelaciones: number
  noShows: number
  demanda: CeldaDeDemanda[]
}

// Junta las métricas de varios complejos (o deportes) en una sola: suma todo
// y recalcula la ocupación con los totales (no se promedian porcentajes: un
// complejo con 10 turnos no pesa lo mismo que uno con 1.000).
export function sumarMetricas(lista: MetricasDelPeriodo[]): MetricasDelPeriodo {
  let turnosReservados = 0
  let turnosOfrecidos = 0
  let ingresos = 0
  let cancelaciones = 0
  let noShows = 0
  const demanda: CeldaDeDemanda[] = []

  for (const metricas of lista) {
    turnosReservados += metricas.ocupacion.turnosReservados
    turnosOfrecidos += metricas.ocupacion.turnosOfrecidos
    ingresos += metricas.ingresos
    cancelaciones += metricas.cancelaciones
    noShows += metricas.noShows

    for (const celda of metricas.demanda) {
      let existente: CeldaDeDemanda | undefined = undefined
      for (const otra of demanda) {
        if (otra.diaSemana === celda.diaSemana && otra.horaInicio === celda.horaInicio) {
          existente = otra
        }
      }
      if (existente === undefined) {
        demanda.push({ ...celda })
      } else {
        existente.reservas += celda.reservas
      }
    }
  }

  return {
    ocupacion: {
      turnosReservados,
      turnosOfrecidos,
      porcentaje: porcentaje(turnosReservados, turnosOfrecidos),
    },
    ingresos,
    cancelaciones,
    noShows,
    demanda,
  }
}

// Cuánto cambió un valor respecto del período anterior, en %. null cuando el
// anterior fue 0: no hay contra qué comparar (no se puede dividir por 0).
export function variacionPorcentual(actual: number, anterior: number): number | null {
  if (anterior === 0) return null
  return Math.round(((actual - anterior) / anterior) * 100)
}

export function porcentaje(parte: number, total: number): number {
  if (total === 0) return 0
  return Math.round((parte / total) * 100)
}

// La demanda solo trae los horarios que tuvieron reservas: uno que no aparece
// tuvo 0.
export function reservasEn(demanda: CeldaDeDemanda[], diaSemana: number, horaInicio: string) {
  for (const celda of demanda) {
    if (celda.diaSemana === diaSemana && celda.horaInicio === horaInicio) {
      return celda.reservas
    }
  }
  return 0
}

export function horariosDistintos(demanda: CeldaDeDemanda[]): string[] {
  const horarios: string[] = []
  for (const celda of demanda) {
    if (!horarios.includes(celda.horaInicio)) {
      horarios.push(celda.horaInicio)
    }
  }
  return horarios.sort()
}

export function horarioMasPedido(demanda: CeldaDeDemanda[]): CeldaDeDemanda | null {
  let masPedido: CeldaDeDemanda | null = null
  for (const celda of demanda) {
    if (masPedido === null || celda.reservas > masPedido.reservas) {
      masPedido = celda
    }
  }
  if (masPedido === null || masPedido.reservas === 0) return null
  return masPedido
}

// Se busca en toda la grilla (todos los días × los horarios que aparecen), no
// solo en la demanda: así un horario sin ninguna reserva también cuenta.
export function horarioMenosPedido(demanda: CeldaDeDemanda[]): CeldaDeDemanda | null {
  const horarios = horariosDistintos(demanda)
  let menosPedido: CeldaDeDemanda | null = null

  for (let diaSemana = 0; diaSemana < 7; diaSemana++) {
    for (const horaInicio of horarios) {
      const reservas = reservasEn(demanda, diaSemana, horaInicio)
      if (menosPedido === null || reservas < menosPedido.reservas) {
        menosPedido = { diaSemana, horaInicio, reservas }
      }
    }
  }
  return menosPedido
}

// Total de reservas de cada día de la semana. El índice es el día: 0 = domingo.
export function reservasPorDia(demanda: CeldaDeDemanda[]): number[] {
  const totales = [0, 0, 0, 0, 0, 0, 0]
  for (const celda of demanda) {
    totales[celda.diaSemana] += celda.reservas
  }
  return totales
}

// El día de la semana con más reservas (0 = domingo), o null si no hubo ninguna
export function diaMasFuerte(demanda: CeldaDeDemanda[]): number | null {
  const totales = reservasPorDia(demanda)
  let mejorDia: number | null = null

  for (let dia = 0; dia < 7; dia++) {
    if (totales[dia] === 0) continue
    if (mejorDia === null || totales[dia] > totales[mejorDia]) {
      mejorDia = dia
    }
  }
  return mejorDia
}

// Total de reservas de cada horario, en el mismo orden que la lista recibida
export function reservasPorHorario(demanda: CeldaDeDemanda[], horarios: string[]): number[] {
  const totales: number[] = []
  for (const horario of horarios) {
    let total = 0
    for (const celda of demanda) {
      if (celda.horaInicio === horario) {
        total += celda.reservas
      }
    }
    totales.push(total)
  }
  return totales
}

// Mañana (antes de las 12), tarde (12 a 18) y noche. columnas: cuántos de los
// horarios recibidos caen en cada franja (para el encabezado del mapa de
// calor). Las franjas sin horarios no se devuelven.
export function franjasDelDia(demanda: CeldaDeDemanda[], horarios: string[]): Franja[] {
  const franjas: Franja[] = [
    { etiqueta: 'Mañana', columnas: 0, reservas: 0 },
    { etiqueta: 'Tarde', columnas: 0, reservas: 0 },
    { etiqueta: 'Noche', columnas: 0, reservas: 0 },
  ]
  const totales = reservasPorHorario(demanda, horarios)

  for (let i = 0; i < horarios.length; i++) {
    let indice = 2
    if (horarios[i] < '12:00') indice = 0
    else if (horarios[i] < '18:00') indice = 1

    franjas[indice].columnas += 1
    franjas[indice].reservas += totales[i]
  }

  const conHorarios: Franja[] = []
  for (const franja of franjas) {
    if (franja.columnas > 0) {
      conHorarios.push(franja)
    }
  }
  return conHorarios
}

// Los tres fútbol comparten cancha (pasto) y dibujo; el resto tiene el suyo
export type FamiliaDeDeporte = 'futbol' | 'tenis' | 'padel' | 'basquet'

export function familiaDelDeporte(deporte: Deporte): FamiliaDeDeporte {
  if (deporte === 'TENIS') return 'tenis'
  if (deporte === 'PADEL') return 'padel'
  if (deporte === 'BASQUET') return 'basquet'
  return 'futbol'
}

// La clase de globals.css con los colores del deporte (undefined = todos)
export function temaDelDeporte(deporte: Deporte | undefined): string {
  if (deporte === undefined) return 'tema-todos'
  return `tema-${familiaDelDeporte(deporte)}`
}

// Qué tan lleno estuvo algo comparado con lo más lleno
export function nivelDeDemanda(valor: number, maximo: number): 'pico' | 'alta' | 'media' | 'baja' {
  if (maximo === 0 || valor === 0) return 'baja'
  if (valor === maximo) return 'pico'

  const proporcion = valor / maximo
  if (proporcion >= 0.66) return 'alta'
  if (proporcion >= 0.33) return 'media'
  return 'baja'
}

export type Punto = { x: number; y: number }

// Los puntos de una curva dentro de un rectángulo de ancho × alto (en el
// sistema del SVG: y crece para abajo, por eso el 0 queda en y = alto).
// maximo: el valor que toca el techo (para que dos curvas usen la misma escala).
export function puntosDeLaCurva(
  valores: number[],
  ancho: number,
  alto: number,
  maximo: number,
): Punto[] {
  const puntos: Punto[] = []
  for (let i = 0; i < valores.length; i++) {
    const x = valores.length === 1 ? ancho / 2 : (i / (valores.length - 1)) * ancho
    const y = maximo === 0 ? alto : alto - (valores[i] / maximo) * alto
    puntos.push({ x, y })
  }
  return puntos
}

// El atributo d de un <path> que une los puntos con rectas: "M x y L x y ..."
export function trazoDeLinea(puntos: Punto[]): string {
  let trazo = ''
  for (let i = 0; i < puntos.length; i++) {
    const letra = i === 0 ? 'M' : 'L'
    trazo += `${letra}${puntos[i].x.toFixed(1)} ${puntos[i].y.toFixed(1)} `
  }
  return trazo.trim()
}

export type Segmento = { largo: number; inicio: number }

// Partes de una dona dibujada con el trazo de un círculo de largoTotal.
// Cada parte mide lo que le toca de largoTotal, menos una separación para que
// las partes no se peguen. inicio: dónde arranca cada una sobre el círculo.
export function segmentosDeDona(
  valores: number[],
  largoTotal: number,
  separacion: number,
): Segmento[] {
  let total = 0
  for (const valor of valores) {
    total += valor
  }

  const segmentos: Segmento[] = []
  let inicio = 0
  for (const valor of valores) {
    const largoCompleto = total === 0 ? 0 : (valor / total) * largoTotal
    const largo = Math.max(largoCompleto - separacion, 0)
    segmentos.push({ largo, inicio })
    inicio += largoCompleto
  }
  return segmentos
}
