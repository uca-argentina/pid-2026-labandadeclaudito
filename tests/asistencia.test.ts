import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { PATCH as marcarAsistencia } from '@/app/api/bookings/[id]/attendance/route'
import { db } from '@/lib/db'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  diaDeManiana,
  diaEnNDias,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
  sinSesion,
} from './helpers'

type Usuario = Awaited<ReturnType<typeof crearUsuario>>

let duenio: Usuario
let otroDuenio: Usuario
let jugador: Usuario
let canchaId: string

// Una Reserva es única por cancha + fecha + hora de inicio, así que cada
// reserva de test va a un día distinto del pasado para no chocar entre tests.
let diasHaciaAtras = 0

async function crearReservaTerminada() {
  diasHaciaAtras = diasHaciaAtras + 1
  return crearReserva(diaEnNDias(-diasHaciaAtras))
}

// Las canchas de test abren de 08 a 12 con turnos de una hora.
async function crearReserva(fecha: string) {
  const reserva = await db.reserva.create({
    data: {
      canchaId,
      jugadorId: jugador.id,
      fecha: new Date(`${fecha}T00:00:00Z`),
      horaInicio: '10:00',
      horaFin: '11:00',
      estado: 'CONFIRMADA',
      precioTurno: 10000,
    },
  })
  return reserva.id
}

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  otroDuenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
  const { cancha1 } = await crearComplejoConCanchas(duenio.id)
  canchaId = cancha1.id
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

describe('Marcar asistencia (PATCH /api/bookings/[id]/attendance)', () => {
  test('sin sesión devuelve 401', async () => {
    sinSesion()
    const id = await crearReservaTerminada()
    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(401)
  })

  test('un jugador no puede marcar asistencia', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada()
    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(403)
  })

  test('el dueño de otro complejo no puede marcar', async () => {
    loginComo(otroDuenio)
    const id = await crearReservaTerminada()
    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(404)
  })

  test('el dueño marca la inasistencia y se guarda', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada()

    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(200)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistio).toBe(false)
  })

  test('el dueño puede corregirse y marcar que sí asistió', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada()

    await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: true }), conParams({ id }))
    expect(res.status).toBe(200)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistio).toBe(true)
  })

  test('no se puede marcar un turno que todavía no terminó', async () => {
    loginComo(duenio)
    const id = await crearReserva(diaDeManiana())

    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(409)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistio).toBeNull()
  })

  test('no se puede marcar una reserva cancelada', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada()
    await db.reserva.update({ where: { id }, data: { estado: 'CANCELADA' } })

    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(409)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistio).toBeNull()
  })

  test('un body sin asistio devuelve 400', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada()
    const res = await marcarAsistencia(jsonRequest('PATCH', {}), conParams({ id }))
    expect(res.status).toBe(400)
  })
})
