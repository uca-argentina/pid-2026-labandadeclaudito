import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { GET as verDisponibilidad } from '@/app/api/courts/[id]/availability/route'
import { POST as reservar } from '@/app/api/bookings/route'
import { PATCH as cancelarReserva } from '@/app/api/bookings/[id]/route'
import { POST as pagarSena } from '@/app/api/bookings/[id]/deposit/route'
import { db } from '@/lib/db'
import { pendientesVencidas } from '@/lib/bookings'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  diaDeAyer,
  diaDeManiana,
  diaEnNDias,
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
let otraCanchaId: string
let complejoId: string
let reservaId: string

function disponibilidadRequest(fecha: string) {
  return new Request(`http://localhost/test?fecha=${fecha}`)
}

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
  otroJugador = await crearUsuario('JUGADOR')
  const { complejo, cancha1, cancha2 } = await crearComplejoConCanchas(duenio.id)
  complejoId = complejo.id
  canchaId = cancha1.id
  otraCanchaId = cancha2.id
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
    const res = await verDisponibilidad(
      disponibilidadRequest('mañana'),
      conParams({ id: canchaId }),
    )
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
    expect(reserva?.horaFin).toBe('11:00')
  })

  test('la reserva nace pendiente de seña y sin pago', async () => {
    const reserva = await db.reserva.findUnique({
      where: { id: reservaId },
      include: { pago: true },
    })
    expect(reserva?.estado).toBe('PENDIENTE')
    expect(reserva?.pago).toBeNull()
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

describe('Pagar seña (POST /api/bookings/[id]/deposit)', () => {
  test('otro jugador no puede pagarla (403)', async () => {
    loginComo(otroJugador)
    const res = await pagarSena(jsonRequest('POST'), conParams({ id: reservaId }))
    expect(res.status).toBe(403)
  })

  test('el jugador paga la seña y la reserva queda confirmada', async () => {
    loginComo(jugador)
    const res = await pagarSena(jsonRequest('POST'), conParams({ id: reservaId }))
    expect(res.status).toBe(200)

    const reserva = await db.reserva.findUnique({
      where: { id: reservaId },
      include: { pago: true },
    })
    expect(reserva?.estado).toBe('CONFIRMADA')
    // precio 10000 con la seña del 30% del complejo
    expect(reserva?.pago?.monto.toString()).toBe('3000')
    expect(reserva?.pago?.porcentaje).toBe(30)
  })

  test('pagarla de nuevo devuelve 409', async () => {
    loginComo(jugador)
    const res = await pagarSena(jsonRequest('POST'), conParams({ id: reservaId }))
    expect(res.status).toBe(409)
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

  test('el turno cancelado se puede volver a reservar y la cancelada queda intacta', async () => {
    loginComo(otroJugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(201)
    const nueva = (await res.json()).reserva
    expect(nueva.id).not.toBe(reservaId)
    expect(nueva.jugadorId).toBe(otroJugador.id)
    expect(nueva.estado).toBe('PENDIENTE')

    // La cancelada sigue siendo del primer jugador, con su pago
    const cancelada = await db.reserva.findUnique({
      where: { id: reservaId },
      include: { pago: true },
    })
    expect(cancelada?.jugadorId).toBe(jugador.id)
    expect(cancelada?.estado).toBe('CANCELADA')
    expect(cancelada?.pago?.monto.toString()).toBe('3000')
  })

  test('con el turno reservado de nuevo, un tercero no puede reservarlo (409)', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(409)
  })

  test('la DB no deja dos reservas activas en el mismo turno', async () => {
    const activa = await db.reserva.findFirst({
      where: {
        canchaId,
        fecha: new Date(diaDeManiana()),
        horaInicio: '10:00',
        estado: 'PENDIENTE',
      },
    })
    await expect(
      db.reserva.create({
        data: {
          canchaId,
          jugadorId: jugador.id,
          fecha: activa!.fecha,
          horaInicio: '10:00',
          horaFin: '11:00',
          estado: 'CONFIRMADA',
          precioTurno: 10000,
        },
      }),
    ).rejects.toMatchObject({ code: 'P2002' })
  })
})

// Turnos dentro de 5 o 6 días: siempre faltan entre 96 y 168 horas, sin
// importar a qué hora se corre el test. Con 24 hs de política se devuelve;
// con 168 hs (una semana) no.
describe('Política de cancelación (devolución de la seña)', () => {
  const unaSemana = 168

  async function reservarYPagar(fecha: string, horaInicio: string) {
    loginComo(jugador)
    const res = await reservar(jsonRequest('POST', { canchaId, fecha, horaInicio }))
    expect(res.status).toBe(201)
    const json = await res.json()
    const id = json.reserva.id as string
    const pago = await pagarSena(jsonRequest('POST'), conParams({ id }))
    expect(pago.status).toBe(200)
    return id
  }

  async function cancelarYVerSiSeDevolvio(id: string) {
    loginComo(jugador)
    const res = await cancelarReserva(jsonRequest('PATCH'), conParams({ id }))
    expect(res.status).toBe(200)
    const pago = await db.pago.findUnique({ where: { reservaId: id } })
    return pago?.devuelto
  }

  async function cambiarPolitica(horas: number) {
    await db.complejo.update({ where: { id: complejoId }, data: { cancellationHours: horas } })
  }

  afterAll(async () => {
    await cambiarPolitica(24)
  })

  test('el pago congela la política del complejo', async () => {
    await cambiarPolitica(24)
    const id = await reservarYPagar(diaEnNDias(5), '08:00')
    const pago = await db.pago.findUnique({ where: { reservaId: id } })
    expect(pago?.cancellationHours).toBe(24)
  })

  test('cancelando con más anticipación que la política, se devuelve la seña', async () => {
    await cambiarPolitica(24)
    const id = await reservarYPagar(diaEnNDias(5), '09:00')
    expect(await cancelarYVerSiSeDevolvio(id)).toBe(true)
  })

  test('cancelando con menos anticipación que la política, no se devuelve', async () => {
    await cambiarPolitica(unaSemana)
    const id = await reservarYPagar(diaEnNDias(5), '10:00')
    expect(await cancelarYVerSiSeDevolvio(id)).toBe(false)
  })

  test('si el complejo endurece la política después de pagar, vale la de cuando pagó', async () => {
    await cambiarPolitica(24)
    const id = await reservarYPagar(diaEnNDias(5), '11:00')
    await cambiarPolitica(unaSemana)
    expect(await cancelarYVerSiSeDevolvio(id)).toBe(true)
  })

  test('si el complejo afloja la política después de pagar, el jugador aprovecha la nueva', async () => {
    await cambiarPolitica(unaSemana)
    const id = await reservarYPagar(diaEnNDias(6), '08:00')
    await cambiarPolitica(24)
    expect(await cancelarYVerSiSeDevolvio(id)).toBe(true)
  })
})

// Para simular que pasó el tiempo se le resta a createdAt directo en la DB.
describe('Plazo de 15 minutos para pagar la seña', () => {
  const dia = diaEnNDias(7)
  const hace16Minutos = () => new Date(Date.now() - 16 * 60 * 1000)

  async function turnoDisponible(horaInicio: string) {
    loginComo(otroJugador)
    const res = await verDisponibilidad(disponibilidadRequest(dia), conParams({ id: canchaId }))
    const json = await res.json()
    for (const slot of json.slots as Slot[]) {
      if (slot.horaInicio === horaInicio) return slot.disponible
    }
    return null
  }

  async function reservarComo(usuario: Usuario, horaInicio: string) {
    loginComo(usuario)
    const res = await reservar(jsonRequest('POST', { canchaId, fecha: dia, horaInicio }))
    expect(res.status).toBe(201)
    const json = await res.json()
    return json.reserva.id as string
  }

  let vencidaId: string

  test('una pendiente recién pedida ocupa el turno', async () => {
    vencidaId = await reservarComo(jugador, '08:00')
    expect(await turnoDisponible('08:00')).toBe(false)
  })

  test('pasados los 15 minutos sin pagar, el turno se libera', async () => {
    await db.reserva.update({ where: { id: vencidaId }, data: { createdAt: hace16Minutos() } })
    expect(await turnoDisponible('08:00')).toBe(true)
  })

  test('una vencida ya no se puede pagar ni cancelar (409)', async () => {
    loginComo(jugador)
    const pago = await pagarSena(jsonRequest('POST'), conParams({ id: vencidaId }))
    expect(pago.status).toBe(409)
    const cancelacion = await cancelarReserva(jsonRequest('PATCH'), conParams({ id: vencidaId }))
    expect(cancelacion.status).toBe(409)
  })

  test('una vencida no aparece en las reservas del jugador', async () => {
    const reservas = await db.reserva.findMany({
      where: { jugadorId: jugador.id, NOT: pendientesVencidas() },
    })
    const ids: string[] = []
    for (const reserva of reservas) {
      ids.push(reserva.id)
    }
    expect(ids).not.toContain(vencidaId)
  })

  test('otro jugador reserva el turno liberado y la vencida se borra de la DB', async () => {
    const nuevaId = await reservarComo(otroJugador, '08:00')
    expect(nuevaId).not.toBe(vencidaId)
    const vencida = await db.reserva.findUnique({ where: { id: vencidaId } })
    expect(vencida).toBeNull()
  })

  test('reservar un turno cancelado hace mucho no nace vencido', async () => {
    const canceladaId = await reservarComo(jugador, '09:00')
    loginComo(jugador)
    await cancelarReserva(jsonRequest('PATCH'), conParams({ id: canceladaId }))
    await db.reserva.update({ where: { id: canceladaId }, data: { createdAt: hace16Minutos() } })

    // Fila nueva con su propio createdAt: el plazo de 15 minutos arranca ahora
    const nuevaId = await reservarComo(otroJugador, '09:00')
    expect(nuevaId).not.toBe(canceladaId)
    const pago = await pagarSena(jsonRequest('POST'), conParams({ id: nuevaId }))
    expect(pago.status).toBe(200)
  })
})

// Se usan anticipaciones de días (no de horas) para que el resultado no
// dependa de a qué hora se corre el test: 3 días de anticipación siempre
// deja afuera todos los turnos de mañana y nunca los de dentro de 5 días.
describe('Anticipación mínima para reservar', () => {
  const tresDiasEnMinutos = 3 * 24 * 60

  test('con la anticipación del complejo, los turnos de mañana aparecen no disponibles', async () => {
    await db.complejo.update({
      where: { id: complejoId },
      data: { minAdvanceMinutesDefault: tresDiasEnMinutos },
    })

    loginComo(jugador)
    const res = await verDisponibilidad(
      disponibilidadRequest(diaDeManiana()),
      conParams({ id: otraCanchaId }),
    )
    const json = await res.json()

    expect(json.minAdvanceMinutes).toBe(tresDiasEnMinutos)
    for (const slot of json.slots as Slot[]) {
      expect(slot.disponible).toBe(false)
    }
  })

  test('reservar un turno dentro de la anticipación devuelve 400', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId: otraCanchaId, fecha: diaDeManiana(), horaInicio: '09:00' }),
    )
    expect(res.status).toBe(400)

    const reservas = await db.reserva.findMany({ where: { canchaId: otraCanchaId } })
    expect(reservas.length).toBe(0)
  })

  test('un turno fuera de la anticipación se reserva normal', async () => {
    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId: otraCanchaId, fecha: diaEnNDias(5), horaInicio: '09:00' }),
    )
    expect(res.status).toBe(201)
  })

  test('la anticipación de la cancha pisa la del complejo', async () => {
    await db.cancha.update({ where: { id: otraCanchaId }, data: { minAdvanceMinutes: 0 } })

    loginComo(jugador)
    const res = await reservar(
      jsonRequest('POST', { canchaId: otraCanchaId, fecha: diaDeManiana(), horaInicio: '09:00' }),
    )
    expect(res.status).toBe(201)
  })
})
