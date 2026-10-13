import { describe, expect, test } from 'vitest'
import { clasesGrillaAdaptable } from './grid-columns'

describe('clasesGrillaAdaptable', () => {
  test('con 1 resultado, una sola columna angosta', () => {
    expect(clasesGrillaAdaptable(1)).toBe('max-w-xs grid-cols-1')
  })

  test('con 4 resultados, sin tope de ancho y hasta 4 columnas según el contenedor', () => {
    expect(clasesGrillaAdaptable(4)).toBe(
      'grid-cols-1 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4',
    )
  })

  test('las columnas dependen del contenedor, no de la pantalla', () => {
    expect(clasesGrillaAdaptable(4)).not.toMatch(/(^| )(sm|lg|xl):/)
  })

  test('con más de 4 resultados, se queda en 4 columnas (no sigue creciendo)', () => {
    expect(clasesGrillaAdaptable(20)).toBe(clasesGrillaAdaptable(4))
  })

  test('con 0 resultados, no rompe (se trata como 1)', () => {
    expect(clasesGrillaAdaptable(0)).toBe('max-w-xs grid-cols-1')
  })
})
