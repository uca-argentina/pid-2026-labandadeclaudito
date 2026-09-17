import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { POST as registrarUsuario } from '@/app/api/users/route'
import { db } from '@/lib/db'
import { verifyPassword } from '@/lib/passwords'
import { emailDeTest, jsonRequest, limpiarDatosDeTest } from './helpers'

beforeAll(async () => {
  await limpiarDatosDeTest()
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

describe('Registro de usuarios (POST /api/users)', () => {
  test('registra un jugador y guarda el password hasheado', async () => {
    const email = emailDeTest()
    const res = await registrarUsuario(
      jsonRequest('POST', {
        nombre: 'Jugador Nuevo',
        email,
        password: 'password123',
        rol: 'JUGADOR',
      }),
    )
    expect(res.status).toBe(201)

    const usuario = await db.usuario.findUnique({ where: { email } })
    expect(usuario?.rol).toBe('JUGADOR')
    expect(usuario?.passwordHash).not.toBe('password123')
    expect(await verifyPassword('password123', usuario!.passwordHash)).toBe(true)
  })

  test('registra un dueño', async () => {
    const email = emailDeTest()
    const res = await registrarUsuario(
      jsonRequest('POST', {
        nombre: 'Dueño Nuevo',
        email,
        password: 'password123',
        rol: 'DUENIO',
      }),
    )
    expect(res.status).toBe(201)

    const usuario = await db.usuario.findUnique({ where: { email } })
    expect(usuario?.rol).toBe('DUENIO')
  })

  test('no deja registrar dos veces el mismo email (409)', async () => {
    const datos = {
      nombre: 'Repetido',
      email: emailDeTest(),
      password: 'password123',
      rol: 'JUGADOR',
    }
    const primera = await registrarUsuario(jsonRequest('POST', datos))
    expect(primera.status).toBe(201)

    const segunda = await registrarUsuario(jsonRequest('POST', datos))
    expect(segunda.status).toBe(409)
  })

  test('rechaza datos inválidos (400)', async () => {
    const passwordCorto = await registrarUsuario(
      jsonRequest('POST', { nombre: 'Test', email: emailDeTest(), password: '123', rol: 'JUGADOR' }),
    )
    expect(passwordCorto.status).toBe(400)

    const rolInexistente = await registrarUsuario(
      jsonRequest('POST', {
        nombre: 'Test',
        email: emailDeTest(),
        password: 'password123',
        rol: 'ADMIN',
      }),
    )
    expect(rolInexistente.status).toBe(400)
  })
})
