import { describe, expect, test } from 'vitest'
import { clasesGrillaAdaptable } from './grid-columns'

describe('clasesGrillaAdaptable', () => {
  test('con 1 resultado, una sola columna angosta', () => {
    expect(clasesGrillaAdaptable(1)).toBe('max-w-xs grid-cols-1')
  })

  test('con 4 resultados, llega al ancho máximo de 4 columnas', () => {
    expect(clasesGrillaAdaptable(4)).toBe(
      'max-w-5xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    )
  })

  test('con más de 4 resultados, se queda en 4 columnas (no sigue creciendo)', () => {
    expect(clasesGrillaAdaptable(20)).toBe(clasesGrillaAdaptable(4))
  })

  test('con 0 resultados, no rompe (se trata como 1)', () => {
    expect(clasesGrillaAdaptable(0)).toBe('max-w-xs grid-cols-1')
  })
})
