import { describe, expect, test } from 'vitest'
import { filtersToQueryString } from './court-search'

describe('filtersToQueryString', () => {
  test('sin filtros devuelve texto vacío', () => {
    expect(filtersToQueryString({})).toBe('')
  })

  test('arma la query con los filtros que hay, en orden fijo', () => {
    const query = filtersToQueryString({
      zona: 'Palermo',
      deporte: 'FUTBOL_11',
      tipoSuperficie: 'CESPED_SINTETICO',
      precioMin: 10000,
      precioMax: 30000,
    })
    expect(query).toBe(
      '?zona=Palermo&deporte=FUTBOL_11&tipoSuperficie=CESPED_SINTETICO&precioMin=10000&precioMax=30000',
    )
  })

  test('deja afuera los filtros que no se usaron', () => {
    expect(filtersToQueryString({ deporte: 'PADEL' })).toBe('?deporte=PADEL')
  })

  test('escapa los caracteres especiales de la zona', () => {
    expect(filtersToQueryString({ zona: 'Villa Crespo & Almagro' })).toBe(
      '?zona=Villa+Crespo+%26+Almagro',
    )
  })

  test('un precio mínimo de 0 se conserva', () => {
    expect(filtersToQueryString({ precioMin: 0 })).toBe('?precioMin=0')
  })
})
