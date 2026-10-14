import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { POST as reservar } from '@/app/api/bookings/route'
import { db } from '@/lib/db'
import { getAvailableSlots } from '@/lib/availability'
import { getComplexDetail, searchComplexes } from '@/lib/court-search'
import {
  crearComplejoConCanchas,
  crearUsuario,
  datosDeComplejo,
  diaDeManiana,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
} from './helpers'

beforeAll(async () => {
  await limpiarDatosDeTest()
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

// crearComplejoConCanchas lo crea aprobado: acá se lo vuelve a poner pendiente
async function crearComplejoPendiente() {
  const duenio = await crearUsuario('DUENIO')
  const { complejo, cancha1 } = await crearComplejoConCanchas(duenio.id)
  await db.complejo.update({
    where: { id: complejo.id },
    data: { estadoAprobacion: 'PENDIENTE' },
  })
  return { duenio, complejo, cancha1 }
}

async function apareceEnLaBusqueda(complejoId: string) {
  const complejos = await searchComplexes({ zona: datosDeComplejo.zona })
  return complejos.some((complejo) => complejo.id === complejoId)
}

describe('Un complejo pendiente no lo ven los jugadores', () => {
  test('no aparece en la búsqueda ni se puede abrir su detalle', async () => {
    const { complejo } = await crearComplejoPendiente()

    expect(await apareceEnLaBusqueda(complejo.id)).toBe(false)
    expect(await getComplexDetail(complejo.id, {})).toBeNull()
  })

  test('no tiene turnos libres y reservarlo da 404', async () => {
    const { cancha1 } = await crearComplejoPendiente()
    const jugador = await crearUsuario('JUGADOR')
    loginComo(jugador)

    expect(await getAvailableSlots(cancha1.id, new Date(diaDeManiana()))).toBeNull()

    const res = await reservar(
      jsonRequest('POST', { canchaId: cancha1.id, fecha: diaDeManiana(), horaInicio: '10:00' }),
    )
    expect(res.status).toBe(404)
  })

  test('uno aprobado sí aparece en la búsqueda', async () => {
    const duenio = await crearUsuario('DUENIO')
    const { complejo } = await crearComplejoConCanchas(duenio.id)

    expect(await apareceEnLaBusqueda(complejo.id)).toBe(true)
  })
})
