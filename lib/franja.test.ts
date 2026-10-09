import { describe, expect, test } from 'vitest'
import { posicionEnElDia, tramosAbiertos } from './franja'

describe('tramosAbiertos', () => {
  test('horario normal: un solo tramo', () => {
    expect(tramosAbiertos('08:00', '23:00')).toEqual([{ desde: 480, hasta: 1380 }])
  })

  test('cierra a medianoche: un solo tramo hasta las 24 (la madrugada vacía no se agrega)', () => {
    expect(tramosAbiertos('08:00', '00:00')).toEqual([{ desde: 480, hasta: 1440 }])
  })

  test('cierra después de medianoche: madrugada y noche', () => {
    expect(tramosAbiertos('20:00', '03:00')).toEqual([
      { desde: 0, hasta: 180 },
      { desde: 1200, hasta: 1440 },
    ])
  })
})

describe('posicionEnElDia', () => {
  test('de 12:00 a 18:00 es la mitad del día con un cuarto de ancho', () => {
    expect(posicionEnElDia('12:00', '18:00')).toEqual({ izquierda: 50, ancho: 25 })
  })

  test('franja a medio cargar (hasta antes que desde): ancho 0, no negativo', () => {
    expect(posicionEnElDia('18:00', '12:00')).toEqual({ izquierda: 75, ancho: 0 })
  })
})
