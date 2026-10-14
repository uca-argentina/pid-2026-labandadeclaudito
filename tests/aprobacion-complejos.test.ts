import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { PATCH as decidir } from '@/app/api/admin/complexes/[id]/route'
import { POST as reservar } from '@/app/api/bookings/route'
import { db } from '@/lib/db'
import { getAvailableSlots } from '@/lib/availability'
import { getComplexDetail, searchComplexes } from '@/lib/court-search'
import {
  conParams,
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

describe('El admin decide un complejo (PATCH /api/admin/complexes/[id])', () => {
  test('aprobarlo lo hace visible en la búsqueda', async () => {
    const { complejo } = await crearComplejoPendiente()
    loginComo(await crearUsuario('ADMIN'))

    const res = await decidir(
      jsonRequest('PATCH', { estadoAprobacion: 'APROBADO' }),
      conParams({ id: complejo.id }),
    )

    expect(res.status).toBe(200)
    expect(await apareceEnLaBusqueda(complejo.id)).toBe(true)
  })

  test('rechazarlo guarda el motivo y sigue sin aparecer', async () => {
    const { complejo } = await crearComplejoPendiente()
    loginComo(await crearUsuario('ADMIN'))

    const res = await decidir(
      jsonRequest('PATCH', {
        estadoAprobacion: 'RECHAZADO',
        motivoRechazo: 'La dirección no existe',
      }),
      conParams({ id: complejo.id }),
    )

    expect(res.status).toBe(200)
    const guardado = await db.complejo.findUnique({ where: { id: complejo.id } })
    expect(guardado?.estadoAprobacion).toBe('RECHAZADO')
    expect(guardado?.motivoRechazo).toBe('La dirección no existe')
    expect(await apareceEnLaBusqueda(complejo.id)).toBe(false)
  })

  test('rechazar sin motivo da 400 y queda pendiente', async () => {
    const { complejo } = await crearComplejoPendiente()
    loginComo(await crearUsuario('ADMIN'))

    const res = await decidir(
      jsonRequest('PATCH', { estadoAprobacion: 'RECHAZADO', motivoRechazo: '   ' }),
      conParams({ id: complejo.id }),
    )

    expect(res.status).toBe(400)
    const guardado = await db.complejo.findUnique({ where: { id: complejo.id } })
    expect(guardado?.estadoAprobacion).toBe('PENDIENTE')
  })

  test('decidir uno que ya se decidió da 409', async () => {
    const { complejo } = await crearComplejoPendiente()
    loginComo(await crearUsuario('ADMIN'))
    const aprobar = () =>
      decidir(
        jsonRequest('PATCH', { estadoAprobacion: 'APROBADO' }),
        conParams({ id: complejo.id }),
      )

    expect((await aprobar()).status).toBe(200)
    expect((await aprobar()).status).toBe(409)
  })

  test('un complejo inexistente o dado de baja da 404', async () => {
    const { complejo } = await crearComplejoPendiente()
    await db.complejo.update({ where: { id: complejo.id }, data: { activo: false } })
    loginComo(await crearUsuario('ADMIN'))

    const deBaja = await decidir(
      jsonRequest('PATCH', { estadoAprobacion: 'APROBADO' }),
      conParams({ id: complejo.id }),
    )
    const inexistente = await decidir(
      jsonRequest('PATCH', { estadoAprobacion: 'APROBADO' }),
      conParams({ id: 'no-existe' }),
    )

    expect(deBaja.status).toBe(404)
    expect(inexistente.status).toBe(404)
  })

  test('un dueño no puede decidir (403), ni siquiera su propio complejo', async () => {
    const { duenio, complejo } = await crearComplejoPendiente()
    loginComo(duenio)

    const res = await decidir(
      jsonRequest('PATCH', { estadoAprobacion: 'APROBADO' }),
      conParams({ id: complejo.id }),
    )

    expect(res.status).toBe(403)
  })
})
