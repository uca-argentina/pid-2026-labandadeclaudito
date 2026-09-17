import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { GET as verDisponibilidad } from '@/app/api/courts/[id]/availability/route'
import { POST as reservar } from '@/app/api/bookings/route'
import { PATCH as cancelarReserva } from '@/app/api/bookings/[id]/route'
import { db } from '@/lib/db'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  diaDeAyer,
  diaDeManiana,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
  sinSesion,
} from './helpers'

type Usuario = Awaited<ReturnType<typeof crearUsuario>>
type Slot = { horaInicio: string; disponible: boolean }

let duenio: Usuario
let jugador: Usuario
let otroJugador: Usuario
let canchaId: string
let reservaId: string

function disponibilidadRequest(fecha: string) {
  return new Request(`http://localhost/test?fecha=${fecha}`)
}

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
  otroJugador = await crearUsuario('JUGADOR')
  const { cancha1 } = await crearComplejoConCanchas(duenio.id)
  canchaId = cancha1.id
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

describe('Disponibilidad (GET /api/courts/[id]/availability)', () => {
  test('sin sesión devuelve 401', async () => {
    sinSesion()
    const res = await verDisponibilidad(
      disponibilidadRequest(diaDeManiana()),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(401)
  })

  test('con fecha mal formada devuelve 400', async () => {
    loginComo(jugador)
    const res = await verDisponibilidad(disponibilidadRequest('mañana'), conParams({ id: canchaId }))
    expect(res.status).toBe(400)
  })

  test('mañana tiene los 4 turnos libres (08 a 12 hs)', async () => {
    loginComo(jugador)
    const res = await verDisponibilidad(
      disponibilidadRequest(diaDeManiana()),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(200)

    const json = await res.json()
    const horas: string[] = []
    for (const slot of json.slots as Slot[]) {
      horas.push(slot.horaInicio)
      expect(slot.disponible).toBe(true)
    }
    expect(horas).toEqual(['08:00', '09:00', '10:00', '11:00'])
  })
})

describe('Reservar (POST /api/bookings)', () => {
  test('un dueño no puede reservar (403)', async () => {
    loginComo(duenio)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(403)
  })

  test('el jugador reserva y el jugadorId sale de la sesión', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', {
        canchaId,
        fecha: diaDeManiana(),
        horaInicio: '10:00',
        jugadorId: otroJugador.id,
      }),
    )
    expect(res.status).toBe(201)

    const json = await res.json()
    reservaId = json.reserva.id
    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.jugadorId).toBe(jugador.id)
    expect(reserva?.estado).toBe('CONFIRMADA')
    expect(reserva?.horaFin).toBe('11:00')
  })

  test('el turno reservado aparece ocupado en la disponibilidad', async () => {
    loginComo(otroJugador)
    const res = await verDisponibilidad(
      disponibilidadRequest(diaDeManiana()),
      conParams({ id: canchaId }),
    )
    const json = await res.json()

    for (const slot of json.slots as Slot[]) {
      if (slot.horaInicio === '10:00') {
        expect(slot.disponible).toBe(false)
      } else {
        expect(slot.disponible).toBe(true)
      }
    }
  })

  test('no se puede reservar dos veces el mismo turno (409)', async () => {
    loginComo(otroJugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(409)
  })

  test('un horario que no es turno de la cancha devuelve 400', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '08:30' }),
    )
    expect(res.status).toBe(400)
  })

  test('un turno que ya pasó devuelve 400', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeAyer(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(400)
  })

  test('una cancha inexistente devuelve 404', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', {
        canchaId: 'no-existe',
        fecha: diaDeManiana(),
        horaInicio: '10:00',
      }),
    )
    expect(res.status).toBe(404)
  })
})

describe('Cancelar reserva (PATCH /api/bookings/[id])', () => {
  test('otro jugador no puede cancelarla (403)', async () => {
    loginComo(otroJugador)
    const res = await cancelarReserva(jsonRequest('PATCH'), conParams({ id: reservaId }))
    expect(res.status).toBe(403)
  })

  test('el jugador cancela su reserva', async () => {
    loginComo(jugador)
    const res = await cancelarReserva(jsonRequest('PATCH'), conParams({ id: reservaId }))
    expect(res.status).toBe(200)

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.estado).toBe('CANCELADA')
  })

  test('cancelarla de nuevo devuelve 409', async () => {
    loginComo(jugador)
    const res = await cancelarReserva(jsonRequest('PATCH'), conParams({ id: reservaId }))
    expect(res.status).toBe(409)
  })

  test('el turno cancelado se puede volver a reservar', async () => {
    loginComo(otroJugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(201)

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.jugadorId).toBe(otroJugador.id)
    expect(reserva?.estado).toBe('CONFIRMADA')
  })
})
