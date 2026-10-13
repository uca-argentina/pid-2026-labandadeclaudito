import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { db } from '@/lib/db'
import { metricasDelComplejo } from '@/lib/metricas-complejo'
import { crearComplejoConCanchas, crearUsuario, diaDeAyer, limpiarDatosDeTest } from './helpers'

let complejoId: string

// El complejo de test tiene la Cancha 1 de Fútbol 5 y la Cancha 2 de Fútbol 7,
// las dos de 08 a 12 con turnos de una hora (4 turnos por día cada una).
beforeAll(async () => {
  await limpiarDatosDeTest()
  const duenio = await crearUsuario('DUENIO')
  const jugador = await crearUsuario('JUGADOR')
  const { complejo, cancha1, cancha2 } = await crearComplejoConCanchas(duenio.id)
  complejoId = complejo.id

  const ayer = new Date(`${diaDeAyer()}T00:00:00Z`)
  for (const canchaId of [cancha1.id, cancha2.id]) {
    await db.reserva.create({
      data: {
        canchaId,
        jugadorId: jugador.id,
        fecha: ayer,
        horaInicio: '10:00',
        horaFin: '11:00',
        estado: 'CONFIRMADA',
        precioTurno: 10000,
      },
    })
  }
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

describe('metricasDelComplejo con filtro de deporte', () => {
  test('sin filtro cuenta las canchas de todos los deportes', async () => {
    const metricas = await metricasDelComplejo(complejoId, diaDeAyer(), diaDeAyer())
    expect(metricas.ocupacion.turnosOfrecidos).toBe(8)
    expect(metricas.ocupacion.turnosReservados).toBe(2)
  })

  test('con un deporte cuenta solo las canchas de ese deporte', async () => {
    const metricas = await metricasDelComplejo(complejoId, diaDeAyer(), diaDeAyer(), {
      deporte: 'FUTBOL_5',
    })
    expect(metricas.ocupacion.turnosOfrecidos).toBe(4)
    expect(metricas.ocupacion.turnosReservados).toBe(1)
    expect(metricas.demanda).toHaveLength(1)
  })

  test('un deporte que el complejo no tiene da todo en cero', async () => {
    const metricas = await metricasDelComplejo(complejoId, diaDeAyer(), diaDeAyer(), {
      deporte: 'PADEL',
    })
    expect(metricas.ocupacion).toEqual({ turnosReservados: 0, turnosOfrecidos: 0, porcentaje: 0 })
    expect(metricas.demanda).toEqual([])
  })
})
