import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { getComplexDetail, searchComplexes } from '@/lib/court-search'
import {
  datosDeComplejo,
  crearComplejoConCanchas,
  crearUsuario,
  limpiarDatosDeTest,
} from './helpers'

// El complejo de test tiene 2 canchas:
//   Cancha 1: Fútbol 5, césped sintético, $10.000
//   Cancha 2: Fútbol 7, cemento, $15.000
let complejoId: string

beforeAll(async () => {
  await limpiarDatosDeTest()
  const duenio = await crearUsuario('DUENIO')
  const { complejo } = await crearComplejoConCanchas(duenio.id)
  complejoId = complejo.id
})

afterAll(async () => {
  await limpiarDatosDeTest()
})

// Se filtra por la zona de test para no mezclarse con complejos reales de la DB
async function buscar(filtros: Parameters<typeof searchComplexes>[0]) {
  const complejos = await searchComplexes({ zona: datosDeComplejo.zona, ...filtros })
  return complejos.find((complejo) => complejo.id === complejoId)
}

describe('searchComplexes', () => {
  test('sin filtros devuelve el complejo con todas sus canchas', async () => {
    const complejo = await buscar({})
    expect(complejo?.canchas.length).toBe(2)
  })

  test('por deporte deja solo las canchas de ese deporte', async () => {
    const complejo = await buscar({ deporte: 'FUTBOL_7' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('por superficie deja solo las canchas de esa superficie', async () => {
    const complejo = await buscar({ tipoSuperficie: 'CESPED_SINTETICO' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 1')
  })

  test('por precio máximo deja solo las canchas que no lo superan', async () => {
    const complejo = await buscar({ precioMax: 12000 })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 1')
  })

  test('por precio mínimo deja solo las canchas que lo alcanzan', async () => {
    const complejo = await buscar({ precioMin: 12000 })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('el precio mínimo y el máximo se incluyen a sí mismos', async () => {
    const complejo = await buscar({ precioMin: 10000, precioMax: 15000 })
    expect(complejo?.canchas.length).toBe(2)
  })

  test('varios filtros se combinan: deben cumplirse todos en la misma cancha', async () => {
    // Fútbol 7 existe y cuesta menos de 12000 existe, pero no es la misma cancha
    const complejo = await buscar({ deporte: 'FUTBOL_7', precioMax: 12000 })
    expect(complejo).toBeUndefined()
  })

  test('si ninguna cancha cumple, el complejo no aparece', async () => {
    expect(await buscar({ precioMin: 20000 })).toBeUndefined()
    expect(await buscar({ deporte: 'TENIS' })).toBeUndefined()
  })

  test('por zona solo trae los complejos de esa zona', async () => {
    const complejos = await searchComplexes({ zona: 'Zona que no existe' })
    expect(complejos.length).toBe(0)
  })
})

describe('getComplexDetail', () => {
  test('sin filtros muestra todas las canchas del complejo', async () => {
    const complejo = await getComplexDetail(complejoId, {})
    expect(complejo?.canchas.length).toBe(2)
  })

  test('si se buscó por deporte, solo muestra las canchas de ese deporte', async () => {
    const complejo = await getComplexDetail(complejoId, { deporte: 'FUTBOL_7' })
    expect(complejo?.canchas.length).toBe(1)
    expect(complejo?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('los demás filtros también se respetan (superficie y precio)', async () => {
    const porSuperficie = await getComplexDetail(complejoId, { tipoSuperficie: 'CESPED_SINTETICO' })
    expect(porSuperficie?.canchas.length).toBe(1)
    expect(porSuperficie?.canchas[0].nombre).toBe('Cancha 1')

    const porPrecio = await getComplexDetail(complejoId, { precioMin: 12000 })
    expect(porPrecio?.canchas.length).toBe(1)
    expect(porPrecio?.canchas[0].nombre).toBe('Cancha 2')
  })

  test('el complejo sigue existiendo aunque ninguna cancha cumpla los filtros', async () => {
    const complejo = await getComplexDetail(complejoId, { deporte: 'TENIS' })
    expect(complejo?.id).toBe(complejoId)
    expect(complejo?.canchas.length).toBe(0)
  })

  test('un complejo que no existe devuelve null', async () => {
    expect(await getComplexDetail('no-existe', {})).toBeNull()
  })
})
