import { describe, expect, test } from 'vitest'
import {
  contarPorGrupo,
  grupoDelEstado,
  rangoDeFechas,
  urlDeReservasGlobales,
} from './admin-bookings'

describe('grupoDelEstado', () => {
  test('asistió cuenta como finalizada', () => {
    expect(grupoDelEstado('ASISTIO')).toBe('FINALIZADA')
  })

  test('el resto queda igual', () => {
    expect(grupoDelEstado('PENDIENTE')).toBe('PENDIENTE')
    expect(grupoDelEstado('CONFIRMADA')).toBe('CONFIRMADA')
    expect(grupoDelEstado('EN_CURSO')).toBe('EN_CURSO')
    expect(grupoDelEstado('FINALIZADA')).toBe('FINALIZADA')
    expect(grupoDelEstado('NO_SHOW')).toBe('NO_SHOW')
    expect(grupoDelEstado('CANCELADA')).toBe('CANCELADA')
  })
})

describe('contarPorGrupo', () => {
  test('sin reservas, todo en cero', () => {
    expect(contarPorGrupo([])).toEqual({
      PENDIENTE: 0,
      CONFIRMADA: 0,
      EN_CURSO: 0,
      FINALIZADA: 0,
      NO_SHOW: 0,
      CANCELADA: 0,
    })
  })

  test('cuenta cada grupo y la suma da el total', () => {
    const conteo = contarPorGrupo(['FINALIZADA', 'CANCELADA', 'FINALIZADA', 'NO_SHOW'])
    expect(conteo.FINALIZADA).toBe(2)
    expect(conteo.CANCELADA).toBe(1)
    expect(conteo.NO_SHOW).toBe(1)
    expect(conteo.PENDIENTE).toBe(0)

    let total = 0
    for (const cantidad of Object.values(conteo)) total += cantidad
    expect(total).toBe(4)
  })
})

describe('rangoDeFechas', () => {
  const hoy = '2026-10-07'
  const porDefecto = { desde: '2026-09-07', hasta: '2026-11-06' }

  test('sin fechas: un mes para atrás y uno para adelante', () => {
    expect(rangoDeFechas(undefined, undefined, hoy)).toEqual(porDefecto)
  })

  test('con una sola fecha usa el default', () => {
    expect(rangoDeFechas('2026-10-01', undefined, hoy)).toEqual(porDefecto)
  })

  test('respeta un rango válido', () => {
    expect(rangoDeFechas('2026-01-01', '2026-03-31', hoy)).toEqual({
      desde: '2026-01-01',
      hasta: '2026-03-31',
    })
  })

  test('un solo día es válido', () => {
    expect(rangoDeFechas(hoy, hoy, hoy)).toEqual({ desde: hoy, hasta: hoy })
  })

  test('desde después de hasta usa el default', () => {
    expect(rangoDeFechas('2026-10-10', '2026-10-01', hoy)).toEqual(porDefecto)
  })

  test('acepta hasta 366 días y rechaza uno más', () => {
    expect(rangoDeFechas('2026-01-01', '2027-01-01', hoy)).toEqual({
      desde: '2026-01-01',
      hasta: '2027-01-01',
    })
    expect(rangoDeFechas('2026-01-01', '2027-01-02', hoy)).toEqual(porDefecto)
  })
})

describe('urlDeReservasGlobales', () => {
  test('solo las fechas', () => {
    expect(urlDeReservasGlobales({ desde: '2026-10-01', hasta: '2026-10-31' })).toBe(
      '/admin/reservas?desde=2026-10-01&hasta=2026-10-31',
    )
  })

  test('con todos los filtros', () => {
    expect(
      urlDeReservasGlobales({
        estado: 'NO_SHOW',
        complejoId: 'abc',
        desde: '2026-10-01',
        hasta: '2026-10-31',
        pagina: 3,
      }),
    ).toBe(
      '/admin/reservas?estado=NO_SHOW&complejoId=abc&desde=2026-10-01&hasta=2026-10-31&pagina=3',
    )
  })

  test('la página 1 no va en la URL', () => {
    expect(urlDeReservasGlobales({ desde: '2026-10-01', hasta: '2026-10-31', pagina: 1 })).toBe(
      '/admin/reservas?desde=2026-10-01&hasta=2026-10-31',
    )
  })
})
