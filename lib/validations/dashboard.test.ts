import { describe, expect, test } from 'vitest'
import { dashboardFiltersSchema } from './dashboard'

describe('dashboardFiltersSchema', () => {
  test('sin nada en la URL usa los últimos 30 días y ningún complejo', () => {
    expect(dashboardFiltersSchema.parse({})).toEqual({
      complejoId: undefined,
      dias: 30,
      deporte: undefined,
    })
  })

  test('acepta 7 días y un complejo', () => {
    expect(dashboardFiltersSchema.parse({ complejoId: 'abc', dias: '7' })).toEqual({
      complejoId: 'abc',
      dias: 7,
      deporte: undefined,
    })
  })

  test('un período que no existe vuelve a 30 días', () => {
    expect(dashboardFiltersSchema.parse({ dias: '9999' }).dias).toBe(30)
  })

  test('valores repetidos en la URL (llegan como array) se ignoran', () => {
    const filtros = dashboardFiltersSchema.parse({ complejoId: ['a', 'b'], dias: ['7', '30'] })
    expect(filtros).toEqual({ complejoId: undefined, dias: 30, deporte: undefined })
  })

  test('complejoId vacío se ignora', () => {
    expect(dashboardFiltersSchema.parse({ complejoId: '' }).complejoId).toBeUndefined()
  })

  test('acepta los últimos 90 días', () => {
    expect(dashboardFiltersSchema.parse({ dias: '90' }).dias).toBe(90)
  })

  test('acepta un deporte del enum', () => {
    expect(dashboardFiltersSchema.parse({ deporte: 'PADEL' }).deporte).toBe('PADEL')
  })

  test('un deporte que no existe es como no filtrar (todos)', () => {
    expect(dashboardFiltersSchema.parse({ deporte: 'HOCKEY' }).deporte).toBeUndefined()
  })
})
