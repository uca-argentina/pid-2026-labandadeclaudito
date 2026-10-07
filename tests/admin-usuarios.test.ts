import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { PATCH as cambiarActivo } from '@/app/api/admin/users/[id]/route'
import { db } from '@/lib/db'
import { getComplexDetail, searchComplexes } from '@/lib/court-search'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  datosDeComplejo,
  diaDeAyer,
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

describe('Suspender y reactivar cuentas (PATCH /api/admin/users/[id])', () => {
  test('el admin suspende y reactiva una cuenta', async () => {
    const admin = await crearUsuario('ADMIN')
    const jugador = await crearUsuario('JUGADOR')
    loginComo(admin)

    const suspender = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: jugador.id }),
    )
    expect(suspender.status).toBe(200)
    expect((await db.usuario.findUnique({ where: { id: jugador.id } }))?.activo).toBe(false)

    const reactivar = await cambiarActivo(
      jsonRequest('PATCH', { activo: true }),
      conParams({ id: jugador.id }),
    )
    expect(reactivar.status).toBe(200)
    expect((await db.usuario.findUnique({ where: { id: jugador.id } }))?.activo).toBe(true)
  })

  test('el admin no puede suspenderse a sí mismo (400)', async () => {
    const admin = await crearUsuario('ADMIN')
    loginComo(admin)

    const res = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: admin.id }),
    )
    expect(res.status).toBe(400)
    expect((await db.usuario.findUnique({ where: { id: admin.id } }))?.activo).toBe(true)
  })

  test('un dueño o un jugador no pueden suspender a nadie (403)', async () => {
    const duenio = await crearUsuario('DUENIO')
    const jugador = await crearUsuario('JUGADOR')
    loginComo(duenio)

    const res = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: jugador.id }),
    )
    expect(res.status).toBe(403)
  })

  test('datos inválidos (400) y usuario inexistente (404)', async () => {
    const admin = await crearUsuario('ADMIN')
    const jugador = await crearUsuario('JUGADOR')
    loginComo(admin)

    const invalido = await cambiarActivo(
      jsonRequest('PATCH', { activo: 'no' }),
      conParams({ id: jugador.id }),
    )
    expect(invalido.status).toBe(400)

    const inexistente = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: 'no-existe' }),
    )
    expect(inexistente.status).toBe(404)
  })
})

describe('Complejos de un dueño suspendido', () => {
  test('no aparecen en la búsqueda ni en el detalle', async () => {
    const duenio = await crearUsuario('DUENIO')
    const { complejo } = await crearComplejoConCanchas(duenio.id)
    await db.usuario.update({ where: { id: duenio.id }, data: { activo: false } })

    const resultados = await searchComplexes({ zona: datosDeComplejo.zona })
    expect(resultados.find((c) => c.id === complejo.id)).toBeUndefined()
    expect(await getComplexDetail(complejo.id, {})).toBeNull()
  })
})

// Una reserva confirmada con la seña pagada, creada directo en la DB
async function crearReservaConSena(canchaId: string, jugadorId: string, dia: string) {
  const reserva = await db.reserva.create({
    data: {
      canchaId,
      jugadorId,
      fecha: new Date(dia),
      horaInicio: '10:00',
      horaFin: '11:00',
      estado: 'CONFIRMADA',
      precioTurno: 10000,
    },
  })
  await db.pago.create({ data: { reservaId: reserva.id, monto: 3000, porcentaje: 30 } })
  return reserva.id
}

describe('Al suspender se cancelan las reservas futuras', () => {
  test('suspender un jugador cancela sus próximas reservas y devuelve la seña', async () => {
    const admin = await crearUsuario('ADMIN')
    const duenio = await crearUsuario('DUENIO')
    const jugador = await crearUsuario('JUGADOR')
    const { cancha1 } = await crearComplejoConCanchas(duenio.id)
    const futura = await crearReservaConSena(cancha1.id, jugador.id, diaDeManiana())
    const pasada = await crearReservaConSena(cancha1.id, jugador.id, diaDeAyer())
    loginComo(admin)

    const res = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: jugador.id }),
    )
    expect(res.status).toBe(200)
    expect((await res.json()).reservasCanceladas).toBe(1)

    const reservaFutura = await db.reserva.findUnique({
      where: { id: futura },
      include: { pago: true },
    })
    expect(reservaFutura?.estado).toBe('CANCELADA')
    expect(reservaFutura?.pago?.devuelto).toBe(true)

    // la que ya se jugó queda en el historial como estaba
    const reservaPasada = await db.reserva.findUnique({ where: { id: pasada } })
    expect(reservaPasada?.estado).toBe('CONFIRMADA')
  })

  test('suspender un dueño cancela las próximas reservas de sus canchas', async () => {
    const admin = await crearUsuario('ADMIN')
    const duenio = await crearUsuario('DUENIO')
    const jugador = await crearUsuario('JUGADOR')
    const { cancha1, cancha2 } = await crearComplejoConCanchas(duenio.id)
    const enCancha1 = await crearReservaConSena(cancha1.id, jugador.id, diaDeManiana())
    const enCancha2 = await db.reserva.create({
      data: {
        canchaId: cancha2.id,
        jugadorId: jugador.id,
        fecha: new Date(diaDeManiana()),
        horaInicio: '11:00',
        horaFin: '12:00',
        estado: 'PENDIENTE',
        precioTurno: 15000,
      },
    })
    loginComo(admin)

    const res = await cambiarActivo(
      jsonRequest('PATCH', { activo: false }),
      conParams({ id: duenio.id }),
    )
    expect(res.status).toBe(200)
    expect((await res.json()).reservasCanceladas).toBe(2)
    expect((await db.reserva.findUnique({ where: { id: enCancha1 } }))?.estado).toBe('CANCELADA')
    expect((await db.reserva.findUnique({ where: { id: enCancha2.id } }))?.estado).toBe('CANCELADA')
  })
})
