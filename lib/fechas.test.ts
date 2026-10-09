import { describe, expect, test } from 'vitest'
import { diaCercano, diaEnPalabras, diaYNumero, proximoSabado } from './fechas'

describe('diaEnPalabras', () => {
  test('escribe el día de la semana, el número y el mes', () => {
    expect(diaEnPalabras('2026-10-10')).toBe('Sábado 10 de octubre')
  })

  test('saca el cero de adelante del día', () => {
    expect(diaEnPalabras('2026-03-02')).toBe('Lunes 2 de marzo')
  })
})

describe('diaYNumero', () => {
  test('escribe solo el día de la semana y el número', () => {
    expect(diaYNumero('2026-10-13')).toBe('Martes 13')
  })
})

describe('diaCercano', () => {
  test('reconoce hoy y mañana', () => {
    expect(diaCercano('2026-10-09', '2026-10-09')).toBe('hoy')
    expect(diaCercano('2026-10-10', '2026-10-09')).toBe('mañana')
  })

  test('mañana puede caer en el mes siguiente', () => {
    expect(diaCercano('2026-11-01', '2026-10-31')).toBe('mañana')
  })

  test('cualquier otro día devuelve null', () => {
    expect(diaCercano('2026-10-11', '2026-10-09')).toBeNull()
    expect(diaCercano('2026-10-08', '2026-10-09')).toBeNull()
  })
})

describe('proximoSabado', () => {
  test('desde un viernes es el día siguiente', () => {
    expect(proximoSabado('2026-10-09')).toBe('2026-10-10')
  })

  test('si hoy es sábado, es hoy', () => {
    expect(proximoSabado('2026-10-10')).toBe('2026-10-10')
  })

  test('desde un domingo es el sábado de la semana que empieza', () => {
    expect(proximoSabado('2026-10-11')).toBe('2026-10-17')
  })
})
