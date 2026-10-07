import { describe, expect, test } from 'vitest'
import { dashboardFiltersSchema } from './dashboard'

describe('dashboardFiltersSchema', () => {
  test('sin nada en la URL: hoy, todos los complejos y todos los deportes', () => {
    expect(dashboardFiltersSchema.parse({})).toEqual({
      complejoId: undefined,
      vista: 'dia',
      fecha: undefined,
      deporte: undefined,
    })
  })

  test('acepta una semana con fecha y complejo', () => {
    expect(
      dashboardFiltersSchema.parse({ complejoId: 'abc', vista: 'semana', fecha: '2026-10-07' }),
    ).toEqual({ complejoId: 'abc', vista: 'semana', fecha: '2026-10-07', deporte: undefined })
  })

  test('una vista que no existe vuelve a día', () => {
    expect(dashboardFiltersSchema.parse({ vista: 'anio' }).vista).toBe('dia')
  })

  test('una fecha que no existe se ignora (31 de febrero, texto cualquiera)', () => {
    expect(dashboardFiltersSchema.parse({ fecha: '2026-02-31' }).fecha).toBeUndefined()
    expect(dashboardFiltersSchema.parse({ fecha: 'ayer' }).fecha).toBeUndefined()
  })

  test('valores repetidos en la URL (llegan como array) se ignoran', () => {
    const filtros = dashboardFiltersSchema.parse({ complejoId: ['a', 'b'], vista: ['mes', 'dia'] })
    expect(filtros.complejoId).toBeUndefined()
    expect(filtros.vista).toBe('dia')
  })

  test('complejoId vacío se ignora', () => {
    expect(dashboardFiltersSchema.parse({ complejoId: '' }).complejoId).toBeUndefined()
  })

  test('acepta un deporte del enum', () => {
    expect(dashboardFiltersSchema.parse({ deporte: 'PADEL' }).deporte).toBe('PADEL')
  })

  test('un deporte que no existe es como no filtrar (todos)', () => {
    expect(dashboardFiltersSchema.parse({ deporte: 'HOCKEY' }).deporte).toBeUndefined()
  })
})
