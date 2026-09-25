import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { POST as crearBloqueo } from '@/app/api/courts/[id]/blocks/route'
import { PATCH as editarBloqueo, DELETE as borrarBloqueo } from '@/app/api/blocks/[id]/route'
import { POST as reservar } from '@/app/api/bookings/route'
import { db } from '@/lib/db'
import { diaDeHoy } from '@/lib/time'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
  sinSesion,
} from './helpers'

type Usuario = Awaited<ReturnType<typeof crearUsuario>>

let duenio: Usuario
let otroDuenio: Usuario
let jugador: Usuario

function diaEnNDias(dias: number) {
  const fecha = new Date(`${diaDeHoy()}T00:00:00Z`)
  fecha.setUTCDate(fecha.getUTCDate() + dias)
  return fecha.toISOString().slice(0, 10)
}

beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  otroDuenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

async function reservarEnFecha(canchaId: string, fecha: string, horaInicio: string) {
  loginComo(jugador)
  const res = await reservar(jsonRequest('POST', { canchaId, fecha, horaInicio }))
  expect(res.status).toBe(201)
  const json = await res.json()
  return json.reserva.id as string
}

describe('POST /api/courts/[id]/blocks', () => {
  let canchaId: string

  beforeAll(async () => {
    const { cancha1 } = await crearComplejoConCanchas(duenio.id)
    canchaId = cancha1.id
  })

  test('otro dueño no puede crear un bloqueo (404)', async () => {
    loginComo(otroDuenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '10:00',
        endTime: '11:00',
      }),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(404)
  })

  test('datos inválidos: fecha de fin anterior a la de inicio (400)', async () => {
    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(2),
        endDate: diaEnNDias(1),
        startTime: '10:00',
        endTime: '11:00',
      }),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(400)
  })

  test('el dueño crea un bloqueo simple (201)', async () => {
    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '09:00',
        reason: 'Mantenimiento de red',
      }),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.reservasCanceladas).toBe(0)
    expect(json.block.reason).toBe('Mantenimiento de red')
  })

  test('un bloqueo que se solapa con otro ya cargado es rechazado (409)', async () => {
    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:30',
        endTime: '09:30',
      }),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(409)
  })

  test('crear un bloqueo cancela las reservas activas que se solapan y deja intactas las que no', async () => {
    const reservaSolapadaId = await reservarEnFecha(canchaId, diaEnNDias(3), '09:00')
    const reservaLibreId = await reservarEnFecha(canchaId, diaEnNDias(3), '11:00')

    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(3),
        endDate: diaEnNDias(4),
        startTime: '09:00',
        endTime: '10:00',
      }),
      conParams({ id: canchaId }),
    )
    expect(res.status).toBe(201)
    const json = await res.json()
    expect(json.reservasCanceladas).toBe(1)

    const reservaSolapada = await db.reserva.findUnique({ where: { id: reservaSolapadaId } })
    expect(reservaSolapada?.estado).toBe('CANCELADA')

    const reservaLibre = await db.reserva.findUnique({ where: { id: reservaLibreId } })
    expect(reservaLibre?.estado).toBe('CONFIRMADA')
  })
})

describe('PATCH /api/blocks/[id]', () => {
  let canchaId: string
  let blockId: string

  beforeAll(async () => {
    const { cancha1 } = await crearComplejoConCanchas(duenio.id)
    canchaId = cancha1.id

    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '09:00',
      }),
      conParams({ id: canchaId }),
    )
    const json = await res.json()
    blockId = json.block.id
  })

  test('otro dueño no puede editar (404)', async () => {
    loginComo(otroDuenio)
    const res = await editarBloqueo(
      jsonRequest('PATCH', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '10:00',
      }),
      conParams({ id: blockId }),
    )
    expect(res.status).toBe(404)
  })

  test('editar sin cambiar el rango no lo rechaza contra sí mismo (200)', async () => {
    loginComo(duenio)
    const res = await editarBloqueo(
      jsonRequest('PATCH', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '09:00',
        reason: 'Actualizado',
      }),
      conParams({ id: blockId }),
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.block.reason).toBe('Actualizado')
  })

  test('editar el rango cancela reservas recién solapadas', async () => {
    const reservaId = await reservarEnFecha(canchaId, diaEnNDias(1), '10:00')

    loginComo(duenio)
    const res = await editarBloqueo(
      jsonRequest('PATCH', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '11:00',
      }),
      conParams({ id: blockId }),
    )
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.reservasCanceladas).toBe(1)

    const reserva = await db.reserva.findUnique({ where: { id: reservaId } })
    expect(reserva?.estado).toBe('CANCELADA')
  })
})

describe('DELETE /api/blocks/[id]', () => {
  let blockId: string

  beforeAll(async () => {
    const { cancha1 } = await crearComplejoConCanchas(duenio.id)

    loginComo(duenio)
    const res = await crearBloqueo(
      jsonRequest('POST', {
        startDate: diaEnNDias(1),
        endDate: diaEnNDias(1),
        startTime: '08:00',
        endTime: '09:00',
      }),
      conParams({ id: cancha1.id }),
    )
    const json = await res.json()
    blockId = json.block.id
  })

  test('otro dueño no puede borrar (404)', async () => {
    loginComo(otroDuenio)
    const res = await borrarBloqueo(jsonRequest('DELETE'), conParams({ id: blockId }))
    expect(res.status).toBe(404)
  })

  test('el dueño lo borra (200) y desaparece de la base', async () => {
    loginComo(duenio)
    const res = await borrarBloqueo(jsonRequest('DELETE'), conParams({ id: blockId }))
    expect(res.status).toBe(200)

    const block = await db.block.findUnique({ where: { id: blockId } })
    expect(block).toBeNull()
  })

  test('borrarlo de nuevo ya no lo encuentra (404)', async () => {
    loginComo(duenio)
    const res = await borrarBloqueo(jsonRequest('DELETE'), conParams({ id: blockId }))
    expect(res.status).toBe(404)
  })
})
