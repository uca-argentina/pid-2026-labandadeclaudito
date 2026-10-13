import { describe, expect, test } from 'vitest'
import { deportesDistintos, precioMasBajo } from './resumen-complejo'

describe('deportesDistintos', () => {
  test('cada deporte una sola vez, en el orden en que aparece', () => {
    const canchas = [
      { deporte: 'PADEL' as const },
      { deporte: 'FUTBOL_5' as const },
      { deporte: 'PADEL' as const },
    ]
    expect(deportesDistintos(canchas)).toEqual(['PADEL', 'FUTBOL_5'])
  })

  test('sin canchas, lista vacía', () => {
    expect(deportesDistintos([])).toEqual([])
  })
})

describe('precioMasBajo', () => {
  test('el menor priceFrom', () => {
    expect(precioMasBajo([{ priceFrom: 30000 }, { priceFrom: 18000 }, { priceFrom: 25000 }])).toBe(
      18000,
    )
  })

  test('sin canchas (ninguna cumple los filtros), null y no rompe', () => {
    expect(precioMasBajo([])).toBeNull()
  })
})
