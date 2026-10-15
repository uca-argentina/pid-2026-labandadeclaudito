import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { POST as abrirDisputa } from '@/app/api/disputes/route'
import { PATCH as marcarAsistencia } from '@/app/api/bookings/[id]/attendance/route'
import { db } from '@/lib/db'
import { DIAS_PARA_DISPUTAR } from '@/lib/disputas'
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
let jugador: Usuario
let otroJugador: Usuario
let canchaId: string

const DESCRIPCION = 'Llegué 10 minutos antes y el complejo estaba cerrado, no pudimos jugar.'

// Una Reserva es única por cancha + fecha + hora de inicio, así que cada
// reserva de test va a un día distinto del pasado para no chocar entre tests.
let diasHaciaAtras = 0

// Las canchas de test abren de 08 a 12 con turnos de una hora.
async function crearReservaTerminada(
  asistio: boolean | null,
  asistenciaMarcadaEn: Date | null = new Date(),
) {
  diasHaciaAtras = diasHaciaAtras + 1
  const reserva = await db.reserva.create({
    data: {
      canchaId,
      jugadorId: jugador.id,
      fecha: new Date(`${diaEnNDias(-diasHaciaAtras)}T00:00:00Z`),
      horaInicio: '10:00',
      horaFin: '11:00',
      estado: 'CONFIRMADA',
      precioTurno: 10000,
      asistio,
      asistenciaMarcadaEn: asistio === null ? null : asistenciaMarcadaEn,
    },
  })
  return reserva.id
}

function pedidoDeDisputa(reservaId: string) {
  return jsonRequest('POST', { reservaId, descripcion: DESCRIPCION })
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

describe('Abrir una disputa (POST /api/disputes)', () => {
  test('sin sesión devuelve 401', async () => {
    sinSesion()
    const id = await crearReservaTerminada(false)
    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(401)
  })

  test('el dueño no puede abrir disputas', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada(false)
    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(403)
  })

  test('un jugador no puede disputar la reserva de otro', async () => {
    loginComo(otroJugador)
    const id = await crearReservaTerminada(false)
    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(403)

    const disputa = await db.disputa.findUnique({ where: { reservaId: id } })
    expect(disputa).toBeNull()
  })

  test('sin descripción suficiente devuelve 400', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada(false)
    const res = await abrirDisputa(jsonRequest('POST', { reservaId: id, descripcion: 'no fui' }))
    expect(res.status).toBe(400)
  })

  test('un turno sin marcar no se puede disputar', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada(null)
    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(409)

    const disputa = await db.disputa.findUnique({ where: { reservaId: id } })
    expect(disputa).toBeNull()
  })

  test('un no-show marcado recién se disputa', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada(false)
    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(201)

    const disputa = await db.disputa.findUnique({ where: { reservaId: id } })
    expect(disputa?.estado).toBe('ABIERTA')
    expect(disputa?.jugadorId).toBe(jugador.id)
    expect(disputa?.decision).toBeNull()
  })

  test('no se puede disputar dos veces el mismo turno', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada(false)
    const primera = await abrirDisputa(pedidoDeDisputa(id))
    expect(primera.status).toBe(201)

    const segunda = await abrirDisputa(pedidoDeDisputa(id))
    expect(segunda.status).toBe(409)

    const cuantas = await db.disputa.count({ where: { reservaId: id } })
    expect(cuantas).toBe(1)
  })

  test('pasado el plazo desde la marca ya no se puede disputar', async () => {
    loginComo(jugador)
    const marcaVieja = new Date()
    marcaVieja.setDate(marcaVieja.getDate() - (DIAS_PARA_DISPUTAR + 1))
    const id = await crearReservaTerminada(false, marcaVieja)

    const res = await abrirDisputa(pedidoDeDisputa(id))
    expect(res.status).toBe(409)
  })
})

describe('El dueño no toca la marca si hay disputa', () => {
  test('con una disputa abierta, marcar asistencia devuelve 409', async () => {
    loginComo(jugador)
    const id = await crearReservaTerminada(false)
    expect((await abrirDisputa(pedidoDeDisputa(id))).status).toBe(201)

    loginComo(duenio)
    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: true }), conParams({ id }))
    expect(res.status).toBe(409)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistio).toBe(false)
  })

  test('sin disputa, el dueño corrige la marca y el plazo arranca de nuevo', async () => {
    loginComo(duenio)
    const id = await crearReservaTerminada(false)
    const marcaVieja = await db.reserva.findUnique({ where: { id } })

    const res = await marcarAsistencia(jsonRequest('PATCH', { asistio: false }), conParams({ id }))
    expect(res.status).toBe(200)

    const reserva = await db.reserva.findUnique({ where: { id } })
    expect(reserva?.asistenciaMarcadaEn?.getTime()).toBeGreaterThan(
      marcaVieja!.asistenciaMarcadaEn!.getTime(),
    )
  })
})
