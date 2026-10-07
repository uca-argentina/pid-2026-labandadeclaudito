import { describe, expect, test } from 'vitest'
import { calcularPagina } from './paginacion'

// 45 filas de a 20 = 3 páginas (20 + 20 + 5)
describe('calcularPagina', () => {
  test('sin ?pagina= muestra la primera', () => {
    expect(calcularPagina(undefined, 45, 20)).toEqual({ paginaActual: 1, totalPaginas: 3, skip: 0 })
  })

  test('una página válida saltea las filas de las anteriores', () => {
    expect(calcularPagina('2', 45, 20)).toEqual({ paginaActual: 2, totalPaginas: 3, skip: 20 })
  })

  test('una página que no existe muestra la última', () => {
    expect(calcularPagina('99', 45, 20)).toEqual({ paginaActual: 3, totalPaginas: 3, skip: 40 })
  })

  test('texto, cero o negativos muestran la primera', () => {
    expect(calcularPagina('abc', 45, 20).paginaActual).toBe(1)
    expect(calcularPagina('0', 45, 20).paginaActual).toBe(1)
    expect(calcularPagina('-3', 45, 20).paginaActual).toBe(1)
  })

  test('un decimal se redondea para abajo', () => {
    expect(calcularPagina('2.7', 45, 20)).toEqual({ paginaActual: 2, totalPaginas: 3, skip: 20 })
  })

  test('sin filas hay una sola página, vacía', () => {
    expect(calcularPagina('5', 0, 20)).toEqual({ paginaActual: 1, totalPaginas: 1, skip: 0 })
  })
})
