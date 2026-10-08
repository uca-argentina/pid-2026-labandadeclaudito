import { describe, expect, test } from 'vitest'
import { adminBookingsFiltersSchema } from './admin-bookings'

describe('adminBookingsFiltersSchema', () => {
  test('sin nada en la URL, todo vacío', () => {
    expect(adminBookingsFiltersSchema.parse({})).toEqual({})
  })

  test('acepta filtros válidos', () => {
    const filtros = adminBookingsFiltersSchema.parse({
      estado: 'NO_SHOW',
      complejoId: 'abc',
      desde: '2026-10-01',
      hasta: '2026-10-31',
    })
    expect(filtros).toEqual({
      estado: 'NO_SHOW',
      complejoId: 'abc',
      desde: '2026-10-01',
      hasta: '2026-10-31',
    })
  })

  test('un estado que no es de los 6 se ignora (asistió va dentro de finalizadas)', () => {
    expect(adminBookingsFiltersSchema.parse({ estado: 'ASISTIO' }).estado).toBeUndefined()
    expect(adminBookingsFiltersSchema.parse({ estado: 'cualquiera' }).estado).toBeUndefined()
  })

  test('"todos los complejos" llega vacío y se ignora', () => {
    expect(adminBookingsFiltersSchema.parse({ complejoId: '' }).complejoId).toBeUndefined()
  })

  test('fechas mal escritas o que no existen se ignoran', () => {
    const filtros = adminBookingsFiltersSchema.parse({ desde: 'ayer', hasta: '2026-02-30' })
    expect(filtros.desde).toBeUndefined()
    expect(filtros.hasta).toBeUndefined()
  })

  test('un parámetro repetido (llega como lista) se ignora', () => {
    expect(adminBookingsFiltersSchema.parse({ estado: ['NO_SHOW', 'CANCELADA'] }).estado).toBe(
      undefined,
    )
  })
})
