import { afterAll, describe, expect, test } from 'vitest'
import { db } from '@/lib/db'
import { rolVigente } from '@/lib/rol-vigente'
import { crearUsuario, limpiarDatosDeTest } from './helpers'

// rolVigente() es lo que usa el callback jwt de auth.ts en cada request para
// decidir si la sesión sigue valiendo.

afterAll(async () => {
  await limpiarDatosDeTest()
})

describe('rolVigente', () => {
  test('cuenta activa: devuelve su rol', async () => {
    const jugador = await crearUsuario('JUGADOR')
    expect(await rolVigente(jugador.id)).toBe('JUGADOR')
  })

  test('cuenta suspendida: devuelve null y la sesión se corta', async () => {
    const duenio = await crearUsuario('DUENIO')
    await db.usuario.update({ where: { id: duenio.id }, data: { activo: false } })
    expect(await rolVigente(duenio.id)).toBeNull()
  })

  test('cuenta borrada: devuelve null', async () => {
    const jugador = await crearUsuario('JUGADOR')
    await db.usuario.delete({ where: { id: jugador.id } })
    expect(await rolVigente(jugador.id)).toBeNull()
  })

  test('si le cambian el rol, devuelve el rol nuevo', async () => {
    const usuario = await crearUsuario('JUGADOR')
    await db.usuario.update({ where: { id: usuario.id }, data: { rol: 'DUENIO' } })
    expect(await rolVigente(usuario.id)).toBe('DUENIO')
  })
})
