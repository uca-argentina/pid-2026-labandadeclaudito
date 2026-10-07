import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { POST as reservar } from '@/app/api/bookings/route'
import { PATCH as cancelarReserva } from '@/app/api/bookings/[id]/route'
import { POST as pagarSena } from '@/app/api/bookings/[id]/deposit/route'
import { db } from '@/lib/db'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  diaEnNDias,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
  sinSesion,
} from './helpers'

type Usuario = Awaited<ReturnType<typeof crearUsuario>>

let duenio: Usuario
let canchaId: string
let otraCanchaId: string

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  const { cancha1, cancha2 } = await crearComplejoConCanchas(duenio.id)
  canchaId = cancha1.id
  otraCanchaId = cancha2.id
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

// Reserva como el jugador logueado y devuelve la respuesta
async function pedirReserva(fecha: string, horaInicio: string, cancha = canchaId) {
  return reservar(jsonRequest('POST', { canchaId: cancha, fecha, horaInicio }))
}

describe('Límite de anticipación (30 días)', () => {
  test('a 30 días se puede reservar', async () => {
    loginComo(await crearUsuario('JUGADOR'))
    const res = await pedirReserva(diaEnNDias(30), '08:00')
    expect(res.status).toBe(201)
  })

  test('a 31 días no (400)', async () => {
    loginComo(await crearUsuario('JUGADOR'))
    const res = await pedirReserva(diaEnNDias(31), '08:00')
    expect(res.status).toBe(400)
  })
})

describe('Límite de reservas sin seña (3 a la vez)', () => {
  test('la cuarta pendiente se rechaza; pagando una, se libera el lugar', async () => {
    loginComo(await crearUsuario('JUGADOR'))
    const dia = diaEnNDias(5)

    const ids: string[] = []
    for (const hora of ['08:00', '09:00', '10:00']) {
      const res = await pedirReserva(dia, hora)
      expect(res.status).toBe(201)
      ids.push((await res.json()).reserva.id)
    }

    const cuarta = await pedirReserva(dia, '11:00')
    expect(cuarta.status).toBe(409)

    // Las confirmadas no cuentan: al pagar una seña, puede reservar otra
    const pago = await pagarSena(jsonRequest('POST'), conParams({ id: ids[0] }))
    expect(pago.status).toBe(200)
    const otraVez = await pedirReserva(dia, '11:00')
    expect(otraVez.status).toBe(201)
  })
})

describe('Pagar y cancelar al mismo tiempo', () => {
  test('pagar dos veces a la vez: se cobra una sola seña', async () => {
    loginComo(await crearUsuario('JUGADOR'))
    const res = await pedirReserva(diaEnNDias(6), '08:00')
    const { reserva } = await res.json()

    const [primero, segundo] = await Promise.all([
      pagarSena(jsonRequest('POST'), conParams({ id: reserva.id })),
      pagarSena(jsonRequest('POST'), conParams({ id: reserva.id })),
    ])
    const estados = [primero.status, segundo.status].sort()
    expect(estados).toEqual([200, 409])
    expect(await db.pago.count({ where: { reservaId: reserva.id } })).toBe(1)
  })

  // La carrera no siempre se da igual, así que se prueba varias veces y se
  // revisa que el resultado final sea siempre coherente.
  test('pagar y cancelar a la vez: nunca queda cancelada con la seña cobrada sin decidir', async () => {
    loginComo(await crearUsuario('JUGADOR'))

    for (const hora of ['08:00', '09:00', '10:00']) {
      const res = await pedirReserva(diaEnNDias(7), hora, otraCanchaId)
      const { reserva } = await res.json()

      const [pago, cancelacion] = await Promise.all([
        pagarSena(jsonRequest('POST'), conParams({ id: reserva.id })),
        cancelarReserva(jsonRequest('PATCH'), conParams({ id: reserva.id })),
      ])

      const final = await db.reserva.findUnique({
        where: { id: reserva.id },
        include: { pago: true },
      })

      if (pago.status === 200 && cancelacion.status === 200) {
        // Pagó primero y después canceló viendo el pago: la devolución se
        // decidió con la política (a 7 días, se devuelve)
        expect(final?.estado).toBe('CANCELADA')
        expect(final?.pago?.devuelto).toBe(true)
      } else if (pago.status === 200) {
        // Ganó el pago: la cancelación no se aplicó
        expect(cancelacion.status).toBe(409)
        expect(final?.estado).toBe('CONFIRMADA')
        expect(final?.pago).not.toBeNull()
      } else {
        // Ganó la cancelación: no se cobró la seña
        expect(cancelacion.status).toBe(200)
        expect(final?.estado).toBe('CANCELADA')
        expect(final?.pago).toBeNull()
      }
    }
  })
})
