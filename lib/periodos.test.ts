import { describe, expect, test } from 'vitest'
import {
  cantidadDeDias,
  diaSemanaDe,
  diasDeLaSemanaDe,
  fechaDelPeriodoVecino,
  nombreDelPeriodo,
  periodoQueContiene,
  rangosAComparar,
  tituloDelPeriodo,
} from './periodos'

// 2026-10-07 es miércoles
const hoy = '2026-10-07'

describe('diaSemanaDe', () => {
  test('lee el día de la semana sin correrse por la zona horaria', () => {
    expect(diaSemanaDe('2026-10-07')).toBe(3)
    expect(diaSemanaDe('2026-10-11')).toBe(0)
  })
})

describe('periodoQueContiene', () => {
  test('un día es solo ese día', () => {
    expect(periodoQueContiene(hoy, 'dia')).toEqual({ desde: hoy, hasta: hoy })
  })

  test('la semana va de lunes a domingo', () => {
    expect(periodoQueContiene(hoy, 'semana')).toEqual({ desde: '2026-10-05', hasta: '2026-10-11' })
  })

  test('un domingo es el último día de su semana, no el primero de la siguiente', () => {
    expect(periodoQueContiene('2026-10-11', 'semana').desde).toBe('2026-10-05')
  })

  test('el mes va del 1 al último día', () => {
    expect(periodoQueContiene(hoy, 'mes')).toEqual({ desde: '2026-10-01', hasta: '2026-10-31' })
  })

  test('febrero de un año bisiesto tiene 29 días', () => {
    expect(periodoQueContiene('2028-02-10', 'mes').hasta).toBe('2028-02-29')
  })
})

describe('fechaDelPeriodoVecino', () => {
  test('día anterior y siguiente', () => {
    expect(fechaDelPeriodoVecino(hoy, 'dia', -1)).toBe('2026-10-06')
    expect(fechaDelPeriodoVecino(hoy, 'dia', 1)).toBe('2026-10-08')
  })

  test('semana anterior', () => {
    expect(fechaDelPeriodoVecino(hoy, 'semana', -1)).toBe('2026-09-30')
  })

  test('el mes anterior a enero es diciembre del año pasado', () => {
    expect(fechaDelPeriodoVecino('2026-01-20', 'mes', -1)).toBe('2025-12-01')
  })

  test('el mes siguiente a diciembre es enero del año que viene', () => {
    expect(fechaDelPeriodoVecino('2026-12-31', 'mes', 1)).toBe('2027-01-01')
  })
})

describe('cantidadDeDias', () => {
  test('cuenta los dos extremos', () => {
    expect(cantidadDeDias({ desde: '2026-10-05', hasta: '2026-10-11' })).toBe(7)
    expect(cantidadDeDias({ desde: hoy, hasta: hoy })).toBe(1)
  })
})

describe('nombreDelPeriodo', () => {
  test('días', () => {
    expect(nombreDelPeriodo(hoy, 'dia', hoy)).toBe('Hoy')
    expect(nombreDelPeriodo('2026-10-06', 'dia', hoy)).toBe('Ayer')
    expect(nombreDelPeriodo('2026-10-02', 'dia', hoy)).toBe('Vie 2 oct')
  })

  test('semanas', () => {
    expect(nombreDelPeriodo('2026-10-09', 'semana', hoy)).toBe('Esta semana')
    expect(nombreDelPeriodo('2026-09-30', 'semana', hoy)).toBe('Semana pasada')
    expect(nombreDelPeriodo('2026-09-22', 'semana', hoy)).toBe('21 sep – 27 sep')
  })

  test('meses', () => {
    expect(nombreDelPeriodo(hoy, 'mes', hoy)).toBe('Este mes')
    expect(nombreDelPeriodo('2026-09-15', 'mes', hoy)).toBe('Septiembre 2026')
  })
})

describe('rangosAComparar', () => {
  test('un período que ya terminó se compara entero contra el anterior entero', () => {
    expect(rangosAComparar('2026-09-15', 'mes', hoy)).toEqual({
      actual: { desde: '2026-09-01', hasta: '2026-09-30' },
      anterior: { desde: '2026-08-01', hasta: '2026-08-31' },
    })
  })

  test('este mes va hasta hoy y se compara contra el mismo tramo del mes pasado', () => {
    expect(rangosAComparar(hoy, 'mes', hoy)).toEqual({
      actual: { desde: '2026-10-01', hasta: '2026-10-07' },
      anterior: { desde: '2026-09-01', hasta: '2026-09-07' },
    })
  })

  test('esta semana (de lunes a hoy) contra los mismos días de la semana pasada', () => {
    expect(rangosAComparar(hoy, 'semana', hoy)).toEqual({
      actual: { desde: '2026-10-05', hasta: '2026-10-07' },
      anterior: { desde: '2026-09-28', hasta: '2026-09-30' },
    })
  })

  test('hoy contra ayer', () => {
    expect(rangosAComparar(hoy, 'dia', hoy)).toEqual({
      actual: { desde: hoy, hasta: hoy },
      anterior: { desde: '2026-10-06', hasta: '2026-10-06' },
    })
  })

  test('en curso el día 31: el mes anterior de 30 días no se pasa de su fin', () => {
    expect(rangosAComparar('2026-10-31', 'mes', '2026-10-31').anterior).toEqual({
      desde: '2026-09-01',
      hasta: '2026-09-30',
    })
  })
})

describe('diasDeLaSemanaDe', () => {
  test('un día es solo su día de la semana', () => {
    expect(diasDeLaSemanaDe({ desde: hoy, hasta: hoy })).toEqual([3])
  })

  test('de lunes a miércoles', () => {
    expect(diasDeLaSemanaDe({ desde: '2026-10-05', hasta: '2026-10-07' })).toEqual([1, 2, 3])
  })

  test('un mes tiene los siete, sin repetir', () => {
    expect(diasDeLaSemanaDe({ desde: '2026-10-01', hasta: '2026-10-31' }).length).toBe(7)
  })
})

describe('tituloDelPeriodo', () => {
  test('día con su nombre', () => {
    expect(tituloDelPeriodo(hoy, 'dia')).toBe('Miércoles 7 de octubre')
  })

  test('semana dentro de un mes', () => {
    expect(tituloDelPeriodo(hoy, 'semana')).toBe('5 – 11 de octubre de 2026')
  })

  test('semana que cruza de un mes a otro', () => {
    expect(tituloDelPeriodo('2026-10-01', 'semana')).toBe('28 sep – 4 oct 2026')
  })

  test('mes', () => {
    expect(tituloDelPeriodo(hoy, 'mes')).toBe('Octubre de 2026')
  })
})
