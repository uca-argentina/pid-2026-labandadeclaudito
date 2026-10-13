import { describe, expect, test } from 'vitest'
import {
  contarPorGrupo,
  grupoDelEstado,
  reservasDiaPorDia,
  resumirReservas,
  tasa,
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
        deporte: 'PADEL',
        jugador: 'ana',
        desde: '2026-10-01',
        hasta: '2026-10-31',
        pagina: 3,
      }),
    ).toBe(
      '/admin/reservas?estado=NO_SHOW&complejoId=abc&deporte=PADEL&jugador=ana&desde=2026-10-01&hasta=2026-10-31&pagina=3',
    )
  })

  test('la página 1 no va en la URL', () => {
    expect(urlDeReservasGlobales({ desde: '2026-10-01', hasta: '2026-10-31', pagina: 1 })).toBe(
      '/admin/reservas?desde=2026-10-01&hasta=2026-10-31',
    )
  })
})

describe('resumirReservas', () => {
  const reservas = [
    { dia: '2026-10-10', grupo: 'FINALIZADA' as const },
    { dia: '2026-10-11', grupo: 'NO_SHOW' as const },
    { dia: '2026-10-12', grupo: 'CANCELADA' as const },
    { dia: '2026-10-13', grupo: 'CONFIRMADA' as const },
  ]

  test('las canceladas no cuentan como reservas', () => {
    expect(resumirReservas(reservas).reservas).toBe(3)
  })

  test('cuenta las canceladas sobre el total', () => {
    const resumen = resumirReservas(reservas)
    expect(resumen.canceladas).toBe(1)
    expect(resumen.total).toBe(4)
  })

  test('las ausencias se cuentan sobre los turnos que ya terminaron', () => {
    const resumen = resumirReservas(reservas)
    expect(resumen.ausentes).toBe(1)
    expect(resumen.terminadas).toBe(2)
  })

  test('sin reservas da todo en cero', () => {
    expect(resumirReservas([])).toEqual({
      reservas: 0,
      canceladas: 0,
      total: 0,
      ausentes: 0,
      terminadas: 0,
    })
  })
})

describe('reservasDiaPorDia', () => {
  test('cuenta las reservas de cada día desde el primero, sin las canceladas', () => {
    const reservas = [
      { dia: '2026-10-11', grupo: 'FINALIZADA' as const },
      { dia: '2026-10-13', grupo: 'CONFIRMADA' as const },
      { dia: '2026-10-13', grupo: 'EN_CURSO' as const },
      { dia: '2026-10-13', grupo: 'CANCELADA' as const },
    ]
    expect(reservasDiaPorDia(reservas, '2026-10-11', 3)).toEqual([1, 0, 2])
  })

  test('ignora las reservas fuera del rango', () => {
    const reservas = [{ dia: '2026-10-20', grupo: 'CONFIRMADA' as const }]
    expect(reservasDiaPorDia(reservas, '2026-10-11', 3)).toEqual([0, 0, 0])
  })
})

describe('tasa', () => {
  test('redondea el porcentaje', () => {
    expect(tasa(157, 753)).toBe('21%')
  })

  test('si hay casos pero no llegan al 1%, no dice 0%', () => {
    expect(tasa(1, 557)).toBe('<1%')
  })

  test('sin casos es 0% y sin total no hay tasa', () => {
    expect(tasa(0, 50)).toBe('0%')
    expect(tasa(0, 0)).toBe('—')
  })
})
