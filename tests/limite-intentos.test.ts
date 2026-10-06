import { randomUUID } from 'node:crypto'
import { afterAll, describe, expect, test } from 'vitest'
import { POST as registrar } from '@/app/api/users/route'
import { db } from '@/lib/db'
import {
  borrarIntentos,
  registrarIntento,
  REGISTRO_POR_IP,
  superoElLimite,
} from '@/lib/limite-intentos'
import { emailDeTest, limpiarDatosDeTest } from './helpers'

// Las claves de este archivo llevan "test-": limpiarDatosDeTest las borra
afterAll(async () => {
  await limpiarDatosDeTest()
})

describe('superoElLimite', () => {
  test('corta recién al llegar al máximo dentro de la ventana', async () => {
    const clave = `test-${randomUUID()}`
    const limite = { maximo: 3, minutos: 15 }

    await registrarIntento(clave)
    await registrarIntento(clave)
    expect(await superoElLimite(clave, limite)).toBe(false)

    await registrarIntento(clave)
    expect(await superoElLimite(clave, limite)).toBe(true)
  })

  test('los intentos fuera de la ventana no cuentan', async () => {
    const clave = `test-${randomUUID()}`
    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000)
    for (let i = 0; i < 3; i++) {
      await db.intento.create({ data: { clave, createdAt: haceUnaHora } })
    }
    expect(await superoElLimite(clave, { maximo: 3, minutos: 15 })).toBe(false)
  })

  test('borrarIntentos vuelve a dejar pasar', async () => {
    const clave = `test-${randomUUID()}`
    await registrarIntento(clave)
    await borrarIntentos(clave)
    expect(await superoElLimite(clave, { maximo: 1, minutos: 15 })).toBe(false)
  })
})

describe('POST /api/users con límite por IP', () => {
  function pedidoDeRegistro(ip: string) {
    return new Request('http://localhost/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
      body: JSON.stringify({
        nombre: 'Jugador de test',
        email: emailDeTest(),
        password: 'password123',
        rol: 'JUGADOR',
      }),
    })
  }

  test(`después de ${REGISTRO_POR_IP.maximo} registros desde la misma IP devuelve 429`, async () => {
    const ip = `test-${randomUUID()}`
    for (let i = 0; i < REGISTRO_POR_IP.maximo; i++) {
      const res = await registrar(pedidoDeRegistro(ip))
      expect(res.status).toBe(201)
    }

    const bloqueado = await registrar(pedidoDeRegistro(ip))
    expect(bloqueado.status).toBe(429)

    // otra IP no queda afectada
    const otraIp = await registrar(pedidoDeRegistro(`test-${randomUUID()}`))
    expect(otraIp.status).toBe(201)
  })
})
