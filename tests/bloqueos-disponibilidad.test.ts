import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { GET as verDisponibilidad } from '@/app/api/courts/[id]/availability/route'
import { POST as reservar } from '@/app/api/bookings/route'
import { DELETE as borrarBloqueo } from '@/app/api/blocks/[id]/route'
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
type Slot = { horaInicio: string; disponible: boolean }

let duenio: Usuario
let jugador: Usuario
let canchaId: string
let blockId: string

async function horariosDisponibles(fecha: string) {
  loginComo(jugador)
  const res = await verDisponibilidad(
    new Request(`http://localhost/test?fecha=${fecha}`),
    conParams({ id: canchaId }),
  )
  expect(res.status).toBe(200)
  const json = await res.json()

  const disponibles: string[] = []
  for (const slot of json.slots as Slot[]) {
    if (slot.disponible) {
      disponibles.push(slot.horaInicio)
    }
  }
  return disponibles
}

function pedirReserva(fecha: string, horaInicio: string) {
  loginComo(jugador)
  return reservar(jsonRequest('POST', { canchaId, fecha, horaInicio }))
}

// La cancha abre de 08 a 12 con turnos de 1 hora: 08, 09, 10 y 11.
// El bloqueo (09:00 a 10:30, de mañana a pasado mañana) cubre los turnos de 09 y 10.
beforeAll(async () => {
  await limpiarDatosDeTest()
  duenio = await crearUsuario('DUENIO')
  jugador = await crearUsuario('JUGADOR')
  const { cancha1 } = await crearComplejoConCanchas(duenio.id)
  canchaId = cancha1.id

  const block = await db.block.create({
    data: {
      courtId: canchaId,
      startDate: new Date(diaEnNDias(1)),
      endDate: new Date(diaEnNDias(2)),
      startTime: '09:00',
      endTime: '10:30',
    },
  })
  blockId = block.id
})

afterAll(async () => {
  sinSesion()
  await limpiarDatosDeTest()
})

describe('Disponibilidad con bloqueos (GET /api/courts/[id]/availability)', () => {
  test('los turnos que se cruzan con el bloqueo aparecen no disponibles', async () => {
    expect(await horariosDisponibles(diaEnNDias(1))).toEqual(['08:00', '11:00'])
  })

  test('el último día del rango también está bloqueado', async () => {
    expect(await horariosDisponibles(diaEnNDias(2))).toEqual(['08:00', '11:00'])
  })

  test('un día fuera del rango no se ve afectado', async () => {
    expect(await horariosDisponibles(diaEnNDias(3))).toEqual(['08:00', '09:00', '10:00', '11:00'])
  })
})

describe('Reservar con bloqueos (POST /api/bookings)', () => {
  test('un turno bloqueado no se puede reservar (409) y no se crea la reserva', async () => {
    const res = await pedirReserva(diaEnNDias(1), '09:00')
    expect(res.status).toBe(409)

    const reservas = await db.reserva.findMany({ where: { canchaId } })
    expect(reservas.length).toBe(0)
  })

  test('un turno fuera del bloqueo se reserva normal (201)', async () => {
    const res = await pedirReserva(diaEnNDias(1), '08:00')
    expect(res.status).toBe(201)
  })

  test('al borrar el bloqueo el turno vuelve a poder reservarse', async () => {
    loginComo(duenio)
    const baja = await borrarBloqueo(jsonRequest('DELETE'), conParams({ id: blockId }))
    expect(baja.status).toBe(200)

    expect(await horariosDisponibles(diaEnNDias(1))).toContain('09:00')

    const res = await pedirReserva(diaEnNDias(1), '09:00')
    expect(res.status).toBe(201)
  })
})
