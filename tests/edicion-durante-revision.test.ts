import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest'
import { PATCH as editarComplejo } from '@/app/api/complexes/[id]/route'
import { db } from '@/lib/db'
import { getComplexByOwner } from '@/lib/ownership'
import {
  conParams,
  crearComplejoConCanchas,
  crearUsuario,
  datosDeComplejo,
  jsonRequest,
  limpiarDatosDeTest,
  loginComo,
} from './helpers'

// Para simular la carrera: el endpoint lee el complejo cuando todavía estaba
// pendiente y el admin lo aprueba antes de que se guarde la edición.
vi.mock('@/lib/ownership', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/lib/ownership')>()
  return { ...original, getComplexByOwner: vi.fn(original.getComplexByOwner) }
})

beforeAll(async () => {
  await limpiarDatosDeTest()
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

describe('El dueño edita mientras el admin decide', () => {
  test('guardar un complejo leído como pendiente no pisa la aprobación del admin', async () => {
    const duenio = await crearUsuario('DUENIO')
    const { complejo } = await crearComplejoConCanchas(duenio.id)
    vi.mocked(getComplexByOwner).mockResolvedValueOnce({
      ...complejo,
      estadoAprobacion: 'PENDIENTE',
    })
    loginComo(duenio)

    const res = await editarComplejo(
      jsonRequest('PATCH', { ...datosDeComplejo, nombre: '[TEST] Editado' }),
      conParams({ id: complejo.id }),
    )

    expect(res.status).toBe(200)
    const guardado = await db.complejo.findUnique({ where: { id: complejo.id } })
    expect(guardado?.nombre).toBe('[TEST] Editado')
    expect(guardado?.estadoAprobacion).toBe('APROBADO')
  })
})
