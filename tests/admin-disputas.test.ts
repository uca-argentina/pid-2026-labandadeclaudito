import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { PATCH as resolverDisputa } from '@/app/api/admin/disputes/[id]/route'
import { PATCH as marcarAsistencia } from '@/app/api/bookings/[id]/attendance/route'
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

let admin: Usuario
let duenio: Usuario
let jugador: Usuario
let canchaId: string

const DESCRIPCION = 'Fuimos al turno y jugamos, la falta que nos cargaron está mal.'
const COMENTARIO = 'Revisé las fotos del jugador y le dan la razón.'

// Una Reserva es única por cancha + fecha + hora de inicio, así que cada
// reserva de test va a un día distinto del pasado para no chocar entre tests.
let diasHaciaAtras = 0

// Las canchas de test abren de 08 a 12 con turnos de una hora.
async function crearDisputaAbierta() {
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
      asistio: false,
      asistenciaMarcadaEn: new Date(),
    },
  })
  const disputa = await db.disputa.create({
    data: { reservaId: reserva.id, jugadorId: jugador.id, descripcion: DESCRIPCION },
  })
  return { reservaId: reserva.id, disputaId: disputa.id }
}

function pedidoDeResolucion(decision: 'A_FAVOR_JUGADOR' | 'A_FAVOR_DUENIO') {
  return jsonRequest('PATCH', { decision, comentarioAdmin: COMENTARIO })
}

beforeAll(async () => {
  await limpiarDatosDeTest()
  admin = await crearUsuario('ADMIN')
  duenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
  const { cancha1 } = await crearComplejoConCanchas(duenio.id)
  canchaId = cancha1.id
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

describe('Resolver una disputa (PATCH /api/admin/disputes/[id])', () => {
  test('sin sesión devuelve 401', async () => {
    sinSesion()
    const { disputaId } = await crearDisputaAbierta()

    const res = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_JUGADOR'),
      conParams({ id: disputaId }),
    )
    expect(res.status).toBe(401)
  })

  test('el jugador y el dueño no resuelven disputas', async () => {
    const { disputaId } = await crearDisputaAbierta()

    for (const usuario of [jugador, duenio]) {
      loginComo(usuario)
      const res = await resolverDisputa(
        pedidoDeResolucion('A_FAVOR_JUGADOR'),
        conParams({ id: disputaId }),
      )
      expect(res.status).toBe(403)
    }

    const disputa = await db.disputa.findUnique({ where: { id: disputaId } })
    expect(disputa?.estado).toBe('ABIERTA')
  })

  test('sin comentario suficiente devuelve 400', async () => {
    loginComo(admin)
    const { disputaId } = await crearDisputaAbierta()

    const res = await resolverDisputa(
      jsonRequest('PATCH', { decision: 'A_FAVOR_JUGADOR', comentarioAdmin: 'porque sí' }),
      conParams({ id: disputaId }),
    )
    expect(res.status).toBe(400)
  })

  test('una disputa que no existe devuelve 404', async () => {
    loginComo(admin)

    const res = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_JUGADOR'),
      conParams({ id: 'no-existe' }),
    )
    expect(res.status).toBe(404)
  })

  test('a favor del jugador: el turno deja de ser no-show', async () => {
    loginComo(admin)
    const { reservaId, disputaId } = await crearDisputaAbierta()

    const res = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_JUGADOR'),
      conParams({ id: disputaId }),
    )
    expect(res.status).toBe(200)

    const disputa = await db.disputa.findUnique({ where: { id: disputaId } })
    expect(disputa?.estado).toBe('RESUELTA')
    expect(disputa?.decision).toBe('A_FAVOR_JUGADOR')
    expect(disputa?.comentarioAdmin).toBe(COMENTARIO)
    expect(disputa?.adminId).toBe(admin.id)
    expect(disputa?.resueltaEn).not.toBeNull()

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.asistio).toBe(true)
  })

  test('a favor del complejo: la falta queda como estaba', async () => {
    loginComo(admin)
    const { reservaId, disputaId } = await crearDisputaAbierta()

    const res = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_DUENIO'),
      conParams({ id: disputaId }),
    )
    expect(res.status).toBe(200)

    const disputa = await db.disputa.findUnique({ where: { id: disputaId } })
    expect(disputa?.decision).toBe('A_FAVOR_DUENIO')

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.asistio).toBe(false)
  })

  test('no se puede resolver dos veces', async () => {
    loginComo(admin)
    const { disputaId } = await crearDisputaAbierta()

    const primera = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_JUGADOR'),
      conParams({ id: disputaId }),
    )
    expect(primera.status).toBe(200)

    const segunda = await resolverDisputa(
      pedidoDeResolucion('A_FAVOR_DUENIO'),
      conParams({ id: disputaId }),
    )
    expect(segunda.status).toBe(409)

    // La decisión original queda intacta
    const disputa = await db.disputa.findUnique({ where: { id: disputaId } })
    expect(disputa?.decision).toBe('A_FAVOR_JUGADOR')
  })

  test('resuelta la disputa, el dueño sigue sin poder cambiar la marca', async () => {
    loginComo(admin)
    const { reservaId, disputaId } = await crearDisputaAbierta()
    expect(
      (await resolverDisputa(pedidoDeResolucion('A_FAVOR_JUGADOR'), conParams({ id: disputaId })))
        .status,
    ).toBe(200)

    loginComo(duenio)
    const res = await marcarAsistencia(
      jsonRequest('PATCH', { asistio: false }),
      conParams({ id: reservaId }),
    )
    expect(res.status).toBe(409)

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.asistio).toBe(true)
  })
})
